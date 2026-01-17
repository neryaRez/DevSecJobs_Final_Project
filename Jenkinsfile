pipeline {
  agent any
  triggers {
    githubPush()
  }
  options {
    timestamps()
  }

  environment {
    DOCKERHUB_FRONTEND_IMAGE = 'yourdockerhub/frontend'
    DOCKERHUB_BACKEND_IMAGE  = 'yourdockerhub/backend'
    DOCKERHUB_CREDENTIALS_ID = 'dockerhub-user'

    HELM_REPO_URL            = 'git@github.com:your-org/helm-charts.git'
    HELM_REPO_BRANCH         = 'main'
    HELM_GIT_SSH_KEY_ID       = 'helm-git-ssh-key'

    FRONTEND_DIR             = 'FrontEnd'
    BACKEND_DIR              = 'Backend'

    GIT_COMMITTER_NAME       = 'jenkins'
    GIT_COMMITTER_EMAIL      = 'ci@jenkins.local'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Resolve Environment') {
      steps {
        script {
          def branch = env.BRANCH_NAME
          if (!branch) {
            branch = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
          }
          branch = branch.replaceFirst(/^origin\//, '')

          if (branch == 'develop') {
            env.DEPLOY_ENV = 'dev'
          } else if (branch == 'staging') {
            env.DEPLOY_ENV = 'staging'
          } else if (branch == 'main') {
            env.DEPLOY_ENV = 'prod'
          } else {
            error("Unsupported branch for deployment: ${branch}")
          }

          env.FRONTEND_VALUES = "frontend/values-${env.DEPLOY_ENV}.yaml"
          env.BACKEND_VALUES = "backend/values-${env.DEPLOY_ENV}.yaml"
          echo "Branch: ${branch} -> Environment: ${env.DEPLOY_ENV}"
        }
      }
    }

    stage('Determine Targets') {
      steps {
        script {
          env.COMMIT_MSG = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
          env.GIT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()

          def normalized = env.COMMIT_MSG.trim().toLowerCase()
          def pattern = ~/^(frontend|backend|frontend,backend):\s+.+$/
          if (!(normalized ==~ pattern)) {
            error("Commit message does not follow convention: ${env.COMMIT_MSG}")
          }

          def prefix = normalized.split(':')[0]
          env.BUILD_FRONTEND = prefix.contains('frontend') ? 'true' : 'false'
          env.BUILD_BACKEND  = prefix.contains('backend') ? 'true' : 'false'

          echo "Commit message: ${env.COMMIT_MSG}"
          echo "Short SHA: ${env.GIT_SHA}"
          echo "Build frontend: ${env.BUILD_FRONTEND}, backend: ${env.BUILD_BACKEND}"
        }
      }
    }

    stage('Build & Push Frontend') {
      when {
        expression { return env.BUILD_FRONTEND == 'true' }
      }
      steps {
        withCredentials([
          usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')
        ]) {
          script {
            sh '''
              set -euo pipefail
              echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
              docker build -t "$DOCKERHUB_FRONTEND_IMAGE:$GIT_SHA" "$FRONTEND_DIR"
              docker push "$DOCKERHUB_FRONTEND_IMAGE:$GIT_SHA"
            '''
            def digestRef = sh(script: "docker inspect --format='{{index .RepoDigests 0}}' ${DOCKERHUB_FRONTEND_IMAGE}:${GIT_SHA}", returnStdout: true).trim()
            def digestOnly = digestRef.contains('@') ? digestRef.split('@')[1] : ''
            if (!digestOnly) {
              error("Failed to resolve frontend image digest")
            }
            env.FRONTEND_DIGEST = "@${digestOnly}"
          }
        }
      }
    }

    stage('Build & Push Backend') {
      when {
        expression { return env.BUILD_BACKEND == 'true' }
      }
      steps {
        withCredentials([
          usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')
        ]) {
          script {
            sh '''
              set -euo pipefail
              echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
              docker build -t "$DOCKERHUB_BACKEND_IMAGE:$GIT_SHA" "$BACKEND_DIR"
              docker push "$DOCKERHUB_BACKEND_IMAGE:$GIT_SHA"
            '''
            def digestRef = sh(script: "docker inspect --format='{{index .RepoDigests 0}}' ${DOCKERHUB_BACKEND_IMAGE}:${GIT_SHA}", returnStdout: true).trim()
            def digestOnly = digestRef.contains('@') ? digestRef.split('@')[1] : ''
            if (!digestOnly) {
              error("Failed to resolve backend image digest")
            }
            env.BACKEND_DIGEST = "@${digestOnly}"
          }
        }
      }
    }

    stage('Clone Helm Repo') {
      when {
        expression { return env.BUILD_FRONTEND == 'true' || env.BUILD_BACKEND == 'true' }
      }
      steps {
        withCredentials([
          sshUserPrivateKey(credentialsId: "${HELM_GIT_SSH_KEY_ID}", keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')
        ]) {
          sh '''
            set -euo pipefail
            rm -rf helm-repo
            GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
              git clone --branch "$HELM_REPO_BRANCH" "$HELM_REPO_URL" helm-repo
          '''
        }
      }
    }

    stage('Update Helm Values') {
      when {
        expression { return env.BUILD_FRONTEND == 'true' || env.BUILD_BACKEND == 'true' }
      }
      steps {
        dir('helm-repo') {
          script {
            if (env.BUILD_FRONTEND == 'true') {
              sh "yq -i '.image.tag = strenv(FRONTEND_DIGEST)' ${env.FRONTEND_VALUES}"
            }
            if (env.BUILD_BACKEND == 'true') {
              sh "yq -i '.image.tag = strenv(BACKEND_DIGEST)' ${env.BACKEND_VALUES}"
            }
          }
        }
      }
    }

    stage('Helm Validate') {
      when {
        expression { return env.BUILD_FRONTEND == 'true' || env.BUILD_BACKEND == 'true' }
      }
      steps {
        dir('helm-repo') {
          script {
            if (env.BUILD_FRONTEND == 'true') {
              sh "helm lint ./frontend -f ${env.FRONTEND_VALUES}"
              sh "helm template frontend ./frontend -f ${env.FRONTEND_VALUES} > /dev/null"
            }
            if (env.BUILD_BACKEND == 'true') {
              sh "helm lint ./backend -f ${env.BACKEND_VALUES}"
              sh "helm template backend ./backend -f ${env.BACKEND_VALUES} > /dev/null"
            }
          }
        }
      }
    }

    stage('Commit & Push Helm Repo') {
      when {
        expression { return env.BUILD_FRONTEND == 'true' || env.BUILD_BACKEND == 'true' }
      }
      steps {
        dir('helm-repo') {
          sh """
            git config user.name "${GIT_COMMITTER_NAME}"
            git config user.email "${GIT_COMMITTER_EMAIL}"
          """
          script {
            def changes = sh(script: "git status --porcelain", returnStdout: true).trim()
            if (changes) {
              sh "git add -A"
              sh "git commit -m \"chore: update image digest to ${env.GIT_SHA}\""
              withCredentials([
                sshUserPrivateKey(credentialsId: "${HELM_GIT_SSH_KEY_ID}", keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')
              ]) {
                sh '''
                  set -euo pipefail
                  GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
                    git push origin HEAD:"$HELM_REPO_BRANCH"
                '''
              }
            } else {
              echo "No Helm changes to commit."
            }
          }
        }
      }
    }

    stage('Argo CD Sync') {
      when {
        expression { return env.BUILD_FRONTEND == 'true' || env.BUILD_BACKEND == 'true' }
      }
      steps {
        script {
          if (env.BUILD_FRONTEND == 'true') {
            sh "argocd app sync frontend-app"
            sh "argocd app wait frontend-app --health --sync --timeout 600"
          }
          if (env.BUILD_BACKEND == 'true') {
            sh "argocd app sync backend-app"
            sh "argocd app wait backend-app --health --sync --timeout 600"
          }
        }
      }
    }
  }
}
