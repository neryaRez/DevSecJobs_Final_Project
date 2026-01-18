# DevSecJobs  
**A Full DevOps-Oriented Fullstack Application on AWS EKS**

---

## 🧠 Project Overview

**DevSecJobs** is a fullstack web application designed to simulate a real-world production system for managing jobs, applicants, and recruiters — with a **strong emphasis on DevOps, cloud infrastructure, and CI/CD best practices**.

The project was built not only to deliver application features, but mainly to demonstrate:
- how modern applications are deployed on Kubernetes,
- how cloud infrastructure is provisioned using Infrastructure as Code,
- and how a full CI/CD pipeline will automate build, scan, and deployment processes.

The application is intended for:
- DevOps / Cloud engineers
- Fullstack developers learning production-grade deployments
- Teams practicing Kubernetes + AWS + CI/CD workflows

---

## 🖥️ Application Architecture (High Level)

The system follows a classic **Frontend / Backend / Database** architecture, fully containerized and deployed on **AWS EKS**.

### Frontend (React)
- Built with **React + Vite**
- Styled with **Tailwind CSS**
- Compiled into static assets and served via **Nginx**
- Exposed to the internet through an **AWS Application Load Balancer (ALB)**

The frontend provides:
- User-facing UI
- Forms and pages for interacting with the backend API
- Clean separation from backend logic

### Backend (Flask)
- Built with **Python Flask**
- Exposes a REST API for the frontend
- Handles business logic, validation, and database access
- Includes health checks used by Kubernetes and CI/CD pipelines

The backend is designed to be:
- Stateless
- Horizontally scalable
- Easy to test and deploy independently

### Database
- MySQL running inside Kubernetes
- Uses Persistent Volumes (EBS via CSI driver)
- Abstracted behind backend API (never exposed directly)

---

## ☁️ Cloud & Infrastructure (AWS)

### Networking (VPC)
- Custom VPC (`10.0.0.0/16`)
- **2 Public Subnets**
  - Used by the Application Load Balancer (ALB)
- **2 Private Subnets**
  - Used by EKS worker nodes
- Internet Gateway + NAT Gateway
- Clear separation between public-facing and internal components

### Kubernetes (EKS)
- Managed **AWS EKS cluster**
- Managed Node Group running in **private subnets**
- Cluster add-ons:
  - VPC CNI
  - CoreDNS
  - kube-proxy
  - EBS CSI Driver

### Ingress & Load Balancing
- **AWS Load Balancer Controller** installed via Helm
- Uses **IRSA (IAM Roles for Service Accounts)**
- Kubernetes Ingress automatically provisions an **internet-facing ALB**
- Path-based routing:
  - `/` → frontend
  - `/api/*` → backend

---

## 🧱 Infrastructure as Code (Terraform)

All infrastructure is provisioned using **Terraform**, including:
- VPC and subnets
- EKS cluster and node groups
- IAM roles and policies
- OIDC provider for IRSA
- ECR repositories
- Helm-based installation of ALB Controller

This ensures:
- Reproducibility
- Version control for infrastructure
- Safe scaling and team collaboration

---

## 🐳 Containerization & Registry

- All components are containerized with Docker
- Images are built as **multi-architecture** (amd64 / arm64)
- Stored in **Amazon ECR**
- Image tags are **immutable**
- Lifecycle policies keep the registry clean

Repositories:
- Frontend image
- Backend image
- MySQL image

---

## 🔁 CI/CD Vision (Jenkins – Next Stage)

The next milestone of the project is a **full Jenkins-based CI/CD pipeline**.

Planned pipeline flow:
1. Git push / merge trigger
2. Lint & test (frontend + backend)
3. Docker image build
4. Security scanning (DevSecOps mindset)
5. Push images to ECR
6. Deploy to EKS
7. Rollout verification & health checks

The goal is:
- Zero manual deployment steps
- Safe, repeatable releases
- Clear separation between infrastructure and application lifecycle

---

## 📦 Repository Structure

```
FrontEnd/                  # React + Vite frontend
Backend/                   # Flask backend API
Devops/
  tf/eks/                  # Terraform infrastructure
  k8s/                     # Kubernetes manifests
```

---

## 🎯 Project Status

✅ VPC & networking provisioned  
✅ EKS cluster up and running  
✅ ALB Controller + Ingress operational  
✅ Frontend & Backend deployed  
⏭️ Jenkins CI/CD – coming next  

---

## 🛠️ Tech Stack Summary

- **Frontend:** React, Vite, Tailwind, Nginx
- **Backend:** Python, Flask
- **Database:** MySQL
- **Cloud:** AWS (VPC, EKS, ECR, ALB, IAM)
- **IaC:** Terraform, Helm
- **Orchestration:** Kubernetes
- **CI/CD:** Jenkins (planned)

---

Built by:
Nerya Reznickovich
Yuval Mashiach 
Shay Rachamim