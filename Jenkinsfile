pipeline {
  agent any

  environment {

    NAMESPACE  = 'devsecjobs'

    FE_REPO = 'devsecjobs-frontend'
    BE_REPO = 'devsecjobs-backend'

    FE_DEPLOYMENT = 'frontend-deployment'
    FE_CONTAINER  = 'frontend'

    BE_DEPLOYMENT = 'backend-deployment'
    BE_CONTAINER  = 'backend'

    KUBECONFIG = '/var/lib/jenkins/.kube/config'

  }

  stages {

    stage('Resolve AWS Region & ECR URIs (Generic)') {
      steps {
        script {
          def region = sh(script: 'aws configure get region', returnStdout: true).trim()
          if (!region) {
            error "AWS region is not configured in AWS CLI. Run: aws configure set region <your-region> (on the Jenkins agent)."
          }
          env.AWS_REGION = region

          def accountId = sh(
            script: 'aws sts get-caller-identity --query Account --output text',
            returnStdout: true
          ).trim()
          env.ACCOUNT_ID = accountId

          env.FE_ECR = "${env.ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.FE_REPO}"
          env.BE_ECR = "${env.ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.BE_REPO}"
          echo "Resolved AWS context:"
          echo " - AWS_REGION=${env.AWS_REGION}"
          echo " - ACCOUNT_ID=${env.ACCOUNT_ID}"
          echo " - FE_ECR=${env.FE_ECR}"
          echo " - BE_ECR=${env.BE_ECR}"
        }
      }
    }


    stage('Checkout') {
      steps {
        checkout scm
        sh 'git --no-pager log -1 --oneline'
      }
    }

    stage('Compute Tag') {
      steps {
        script {
          def shortSha = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
          env.IMAGE_TAG = "v${env.BUILD_NUMBER}-${shortSha}"
          echo "IMAGE_TAG = ${env.IMAGE_TAG}"
        }
      }
    }

    stage('Detect Changes') {
      steps {
        script {
          def base = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT?.trim()
          if (!base) {
            base = sh(script: "git rev-parse HEAD~1 || true", returnStdout: true).trim()
          }
          if(!base){
            base = sh(script: "git rev-list --max-parents=0 HEAD", returnStdout: true).trim()
          }
          echo "Diff base commit: ${base}"

          def changed = sh(
            script: "git diff --name-only ${base}..HEAD || true",
            returnStdout: true
          ).trim()

          echo "Changed files:\n${changed}"

          env.CHANGED_FRONTEND = (changed =~ /(?m)^FrontEnd\//) ? "true" : "false"
          env.CHANGED_BACKEND  = (changed =~ /(?m)^Backend\//)  ? "true" : "false"

          echo "CHANGED_FRONTEND=${env.CHANGED_FRONTEND}, CHANGED_BACKEND=${env.CHANGED_BACKEND}"
        }
      }
    }

    stage('No Changes?') {
      when {
        expression { return env.CHANGED_FRONTEND == "false" && env.CHANGED_BACKEND == "false" }
      }
      steps {
        echo "No changes detected in FrontEnd/Backend. Skipping build & deploy."
      }
    }

    stage('Preflight: Tools & Cluster Access') {
      steps {
        sh '''
          set -e
          aws --version
          docker --version

          curl --version

          kubectl version --client=true

          # aws eks update-kubeconfig --region "${AWS_REGION}" --name "${EKS_CLUSTER}"

          kubectl get ns | head
        '''
      }
    }

    stage('ECR Login') {
      steps {
        sh '''
          set -e
          aws ecr get-login-password --region "${AWS_REGION}" \
            | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com" >/dev/null
        '''
      }
    }


    stage('Build & Push Frontend') {
      when { expression { return env.CHANGED_FRONTEND == "true" } }
      steps {
        sh '''
          set -e
          echo "Building FRONTEND:"
          echo " - ${FE_ECR}:${IMAGE_TAG}"
          cd FrontEnd

          docker build -t "${FE_ECR}:${IMAGE_TAG}" .
          docker push "${FE_ECR}:${IMAGE_TAG}"
        '''
      }
    }

    stage('Build & Push Backend') {
      when { expression { return env.CHANGED_BACKEND == "true" } }
      steps {
        sh '''
          set -e
          echo "Building BACKEND:"
          echo " - ${BE_ECR}:${IMAGE_TAG}"
          cd Backend

          docker build -t "${BE_ECR}:${IMAGE_TAG}" .
          docker push "${BE_ECR}:${IMAGE_TAG}"
        '''
      }
    }

    stage('Deploy Frontend') {
      when { expression { return env.CHANGED_FRONTEND == "true" } }
      steps {
        sh '''
          set -e
          echo "Updating FRONTEND deployment image..."
          kubectl set image "deployment/${FE_DEPLOYMENT}" \
            "${FE_CONTAINER}=${FE_ECR}:${IMAGE_TAG}" \
            -n "${NAMESPACE}"

          echo "Waiting for FRONTEND rollout..."
          kubectl rollout status "deployment/${FE_DEPLOYMENT}" -n "${NAMESPACE}" --timeout=5m

          echo "Verify FRONTEND image:"
          kubectl get deploy "${FE_DEPLOYMENT}" -n "${NAMESPACE}" \
            -o=jsonpath='{.spec.template.spec.containers[0].image}{"\\n"}'
        '''
      }
    }

    stage('Deploy Backend') {
      when { expression { return env.CHANGED_BACKEND == "true" } }
      steps {
        sh '''
          set -e
          echo "Updating BACKEND deployment image..."
          kubectl set image "deployment/${BE_DEPLOYMENT}" \
            "${BE_CONTAINER}=${BE_ECR}:${IMAGE_TAG}" \
            -n "${NAMESPACE}"

          echo "Waiting for BACKEND rollout..."
          kubectl rollout status "deployment/${BE_DEPLOYMENT}" -n "${NAMESPACE}" --timeout=5m

          echo "Verify BACKEND image:"
          kubectl get deploy "${BE_DEPLOYMENT}" -n "${NAMESPACE}" \
            -o=jsonpath='{.spec.template.spec.containers[0].image}{"\\n"}'
        '''
      }
    }


    stage('Final Verify (Pods)') {
      when {
        anyOf {
          expression { return env.CHANGED_FRONTEND == "true" }
          expression { return env.CHANGED_BACKEND == "true" }
        }
      }
      steps {
        sh '''
          set -e
          echo "Pods in namespace ${NAMESPACE}:"
          kubectl get pods -n "${NAMESPACE}" -o wide
        '''
      }
    }
  }

  post {
    always {
      echo "Build finished. Frontend changed? ${env.CHANGED_FRONTEND}, Backend changed? ${env.CHANGED_BACKEND}, TAG=${env.IMAGE_TAG}"
    }
  }
}
