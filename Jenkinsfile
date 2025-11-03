pipeline {
  agent any

  environment {
    DOCKER_OPTS = "--pull"
    HEALTH = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .gitsha'
      }
    }

    stage('Build Images') {
      steps {
        script {
          parallel(
            FRONTEND: {
              sh "docker build ${env.DOCKER_OPTS} -t zipon-frontend:latest -t zipon-frontend:$(cat .gitsha) ./frontend"
            },
            BACKEND: {
              sh "docker build ${env.DOCKER_OPTS} -t zipon-backend:latest -t zipon-backend:$(cat .gitsha) ./backend"
            },
            AI: {
              sh "docker build ${env.DOCKER_OPTS} -t zipon-ai:latest -t zipon-ai:$(cat .gitsha) ./ai"
            }
          )
        }
      }
    }

    stage('Deploy PROD') {
      steps {
        sh """
          echo "[PROD] Deploying with ${env.PROD_COMPOSE}"
          docker compose -f ${env.PROD_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[PROD] Health check..."
          sleep 3
          curl -s -o /dev/null -w "FRONT / -> %{http_code}\\n" https://zipon.duckdns.org/
          curl -s -o /dev/null -w "BACK  /api/ -> %{http_code}\\n" https://zipon.duckdns.org/api/
          curl -s -o /dev/null -w "AI    /ai/  -> %{http_code}\\n" https://zipon.duckdns.org/ai/
        """
      }
    }
  }

  post {
    success {
      echo "✅ PROD Deploy success"
    }
    failure {
      echo "❌ PROD Deploy failed. Check logs."
    }
    always {
      sh 'docker image prune -f || true'
    }
  }
}
