<img width="1920" height="877" alt="image" src="https://github.com/user-attachments/assets/f1527096-54ba-424c-ba84-0994b8dadb75" />
<img width="1920" height="879" alt="image" src="https://github.com/user-attachments/assets/d931107a-1759-4a33-9847-41077b06944d" />
<img width="1920" height="866" alt="image" src="https://github.com/user-attachments/assets/859b2080-c00b-4c8c-a6e3-078e778bcf62" />
<img width="1920" height="878" alt="image" src="https://github.com/user-attachments/assets/f57c1c3f-3b76-4251-94d4-98d4c5c939da" />
<img width="1920" height="876" alt="image" src="https://github.com/user-attachments/assets/7aec9c39-9d59-437e-8265-9931a1977504" />
<img width="1920" height="880" alt="image" src="https://github.com/user-attachments/assets/94b83ae6-0505-4bdb-b778-33705198d2a5" />
<img width="1920" height="884" alt="image" src="https://github.com/user-attachments/assets/41a02b42-5054-45d2-bfa7-da5b725f50f5" />
<img width="1920" height="866" alt="image" src="https://github.com/user-attachments/assets/1aa96b32-596a-4dd1-8872-3b7396acd35d" />
<img width="1920" height="894" alt="image" src="https://github.com/user-attachments/assets/70383a50-225c-4736-9fce-b0b81ae7860f" />
<img width="1920" height="871" alt="image" src="https://github.com/user-attachments/assets/727b478c-9afe-4056-bdb3-00ab9171929f" />


# 🚀 AutoOps — Self-Healing CI/CD DevOps Platform

> A production-grade DevOps system implementing CI/CD automation, containerized deployment, monitoring, and Infrastructure as Code.

---

## 📌 Overview

AutoOps automates the complete software delivery lifecycle — from code integration to deployment — using modern DevOps practices. It integrates CI/CD pipelines, container orchestration, monitoring, and self-healing mechanisms into a single platform.

---

## ✨ Features

* ⚡ Automated CI/CD pipeline using GitHub Actions
* 🐳 Containerized microservices with Docker & Docker Compose
* 🔄 Self-healing system using container restart policies
* 📊 Monitoring with Prometheus, Grafana, and cAdvisor
* ☁️ Infrastructure provisioning using Terraform (AWS)
* 🔐 Scalable and production-ready architecture

---

## 🏗️ Architecture

```
Code Push → CI/CD Pipeline → Docker Build → Deployment
                                     ↓
        ┌────────────────────────────────────────────┐
        │ Frontend │ Backend │ MongoDB │ Monitoring  │
        │ 3000     │ 5000    │ 27017   │ Stack       │
        └────────────────────────────────────────────┘
                                     ↓
                     Self-Healing Containers
                                     ↓
                   Metrics → Visualization
```

---

## 🧰 Tech Stack

| Category   | Tools                         |
| ---------- | ----------------------------- |
| Frontend   | React.js                      |
| Backend    | Node.js (Express)             |
| Database   | MongoDB                       |
| CI/CD      | GitHub Actions                |
| Containers | Docker, Docker Compose        |
| Monitoring | Prometheus, Grafana, cAdvisor |
| IaC        | Terraform                     |
| Cloud      | AWS (EC2, S3, VPC)            |

---

## 🚀 Getting Started

### Prerequisites

* Docker & Docker Compose
* Git

---

## 🌐 Services

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| Grafana     | [http://localhost:3001](http://localhost:3001) |
| Prometheus  | [http://localhost:9090](http://localhost:9090) |

---

## ⚙️ CI/CD Pipeline

The pipeline automates:

* Code checkout
* Dependency installation
* Linting & testing
* Docker image build
* Image push to registry
* Deployment to environment

---

## 🏗️ Infrastructure as Code

Terraform configuration provisions:

* EC2 instance
* VPC and networking
* Security groups
* S3 bucket

```bash
cd infrastructure
terraform init
terraform apply
```

---

## 📊 Monitoring

* Prometheus collects metrics
* Grafana provides dashboards
* cAdvisor tracks container performance
* Node Exporter monitors system resources

---

## 📁 Project Structure

```
autoops/
├── frontend/
├── backend/
├── monitoring/
├── infrastructure/
├── .github/workflows/
└── docker-compose.yml
```

---

## Key Concepts

* Continuous Integration & Deployment
* Containerized Microservices
* Self-Healing Systems
* Observability & Monitoring
* Infrastructure as Code

## Monitoring: Prometheus + Grafana stack integrated.
