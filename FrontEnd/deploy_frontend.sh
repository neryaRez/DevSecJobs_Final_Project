#!/usr/bin/env bash
set -euo pipefail

# ==== CONFIG ====
AWS_REGION="us-east-1"
NAMESPACE="devsecjobs"
DEPLOYMENT="frontend-deployment"
CONTAINER_NAME="frontend"
REPO_NAME="devsecjobs-frontend"
ACCOUNT_ID="455715798206"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"

# ==== INPUT TAG ====
TAG="${1:-}"
if [[ -z "${TAG}" ]]; then
  TAG="v$(date +%y%m%d-%H%M%S)"
fi

echo "==> Deploying FRONTEND tag: ${TAG}"
echo "==> ECR: ${ECR_URI}:${TAG}"

# # ==== LOGIN ECR ====
# echo "==> Logging in to ECR..."
# aws ecr get-login-password --region "${AWS_REGION}" \
# | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com" >/dev/null

# ==== BUILD + PUSH ====
echo "==> Building & pushing image..."
# pushd FrontEnd >/dev/null
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "${ECR_URI}:${TAG}" \
  --push \
  .
# popd >/dev/null

# ==== UPDATE DEPLOYMENT IMAGE ====
echo "==> Updating Kubernetes deployment image..."
kubectl set image "deployment/${DEPLOYMENT}" \
  "${CONTAINER_NAME}=${ECR_URI}:${TAG}" \
  -n "${NAMESPACE}"

# ==== ROLLOUT STATUS ====
echo "==> Waiting for rollout..."
kubectl rollout status "deployment/${DEPLOYMENT}" -n "${NAMESPACE}"

# ==== VERIFY ====
echo "==> Verify deployment image:"
kubectl get deploy "${DEPLOYMENT}" -n "${NAMESPACE}" \
  -o=jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'

echo "✅ Done."

