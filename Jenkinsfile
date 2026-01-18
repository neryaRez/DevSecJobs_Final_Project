pipeline {
  agent any
  options {
    timestamps()
    disableConcurrentBuilds()
    ansiColor('xterm')
  }

  environment {
    AWS_REGION = 'us-east-1'
    NAMESPACE  = 'devsecjobs'

    ACCOUNT_ID = '455715798206'

    FE_REPO = 'devsecjobs-frontend'
    BE_REPO = 'devsecjobs-backend'

    FE_ECR = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FE_REPO}"
    BE_ECR = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BE_REPO}"

    FE_DEPLOYMENT = 'frontend-deployment'
    FE_CONTAINER  = 'frontend'

    BE_DEPLOYMENT = 'backend-deployment'
    BE_CONTAINER  = 'backend'

    // חובה למלא (או להוציא מהסטייג' ולהגדיר kubeconfig ידנית פעם אחת בשרת)
    // EKS_CLUSTER = 'YOUR_CLUSTER_NAME'

    // חובה למלא: כתובת ה-ALB/Ingress שלך (דוגמה: k8s-devsecjobs-xxxx.us-east-1.elb.amazonaws.com)
    // HEALTH_URL = 'http://<ALB_DNS_NAME>/health'
    KUBECONFIG = '/var/lib/jenkins/.kube/config'

  }

  stages {

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
          def base = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
          if (!base?.trim()) {
            base = sh(script: "git rev-parse HEAD~1 || true", returnStdout: true).trim()
          }

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

    stage('Preflight: Tools & Cluster Access') {
      steps {
        sh '''
          set -e
          aws --version
          docker --version

          # buildx חייב להיות קיים
          docker buildx version

          # curl לאימות HTTP
          curl --version

          kubectl version --client=true

          # אם לא הגדרת kubeconfig ידנית על השרת, תפתח את זה:
          # aws eks update-kubeconfig --region "${AWS_REGION}" --name "${EKS_CLUSTER}"

          kubectl get ns | head
        '''
      }
    }

    stage('ECR Login') {
      steps {
        sh '''
          set -e
          aws sts get-caller-identity
          aws ecr get-login-password --region "${AWS_REGION}" \
            | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com" >/dev/null
        '''
      }
    }

    stage('Ensure buildx builder') {
      steps {
        sh '''
          set -e
          # יוצרים builder אם אין, ומוודאים שהוא בשימוש
          if ! docker buildx inspect devsecjobs-builder >/dev/null 2>&1; then
            docker buildx create --name devsecjobs-builder --use
          else
            docker buildx use devsecjobs-builder
          fi
          docker buildx inspect --bootstrap
        '''
      }
    }

    stage('Build & Push Frontend (buildx + latest)') {
      when { expression { return env.CHANGED_FRONTEND == "true" } }
      steps {
        sh '''
          set -e
          echo "Building FRONTEND (buildx):"
          echo " - ${FE_ECR}:${IMAGE_TAG}"
          echo " - ${FE_ECR}:latest"
          cd FrontEnd

          docker buildx build \
            --platform linux/amd64,linux/arm64 \
            -t "${FE_ECR}:${IMAGE_TAG}" \
            -t "${FE_ECR}:latest" \
            --push \
            .
        '''
      }
    }

    stage('Build & Push Backend (buildx + latest)') {
      when { expression { return env.CHANGED_BACKEND == "true" } }
      steps {
        sh '''
          set -e
          echo "Building BACKEND (buildx):"
          echo " - ${BE_ECR}:${IMAGE_TAG}"
          echo " - ${BE_ECR}:latest"
          cd Backend

          docker buildx build \
            --platform linux/amd64,linux/arm64 \
            -t "${BE_ECR}:${IMAGE_TAG}" \
            -t "${BE_ECR}:latest" \
            --push \
            .
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
          kubectl rollout status "deployment/${FE_DEPLOYMENT}" -n "${NAMESPACE}"

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
          kubectl rollout status "deployment/${BE_DEPLOYMENT}" -n "${NAMESPACE}"

          echo "Verify BACKEND image:"
          kubectl get deploy "${BE_DEPLOYMENT}" -n "${NAMESPACE}" \
            -o=jsonpath='{.spec.template.spec.containers[0].image}{"\\n"}'
        '''
      }
    }

    stage('HTTP Verify /health (ALB)') {
      when {
        anyOf {
          expression { return env.CHANGED_FRONTEND == "true" }
          expression { return env.CHANGED_BACKEND == "true" }
        }
      }
      steps {
        sh '''
          set -e
          echo "Verifying HTTP health endpoint: ${HEALTH_URL}"

          # מנסים עד 12 פעמים (סה"כ ~60 שניות) כי לפעמים ה-ALB עוד מתעדכן
          for i in $(seq 1 12); do
            code=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}" || true)
            echo "Attempt $i -> HTTP ${code}"

            if [ "${code}" = "200" ]; then
              echo "Health check PASSED"
              exit 0
            fi

            sleep 5
          done

          echo "Health check FAILED after retries"
          exit 1
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
