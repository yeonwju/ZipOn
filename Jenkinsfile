pipeline {
  agent any

  environment {
    DOCKER_OPTS = "--pull"
    HEALTH = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
    DEV_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.dev.yml"
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .gitsha'
      }
    }

    stage('Build Images (parallel)') {
      steps {
        script {
          def gitsha = sh(script: 'cat .gitsha', returnStdout: true).trim()

          parallel failFast: false, 
          FRONTEND: {
            sh "docker build ${env.DOCKER_OPTS} -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend"
          },
          BACKEND: {
            sh "docker build ${env.DOCKER_OPTS} -t zipon-backend:latest -t zipon-backend:${gitsha} ./backend"
          },
          AI: {
            sh "docker build ${env.DOCKER_OPTS} -t zipon-ai:latest -t zipon-ai:${gitsha} ./ai"
          }
        }
      }
    }

    stage('Unit Tests (dev only)') {
      when { branch 'dev' }
      steps {
        sh '''
          echo "[TEST] Running test scripts..."
          # ex) pytest, npm test, gradle test
        '''
      }
    }

    stage('Deploy DEV (optional)') {
      when { branch 'dev' }
      steps {
        script {
          def devComposeExists = sh(script: "test -f ${env.DEV_COMPOSE}", returnStatus: true) == 0
          if (devComposeExists) {
            sh """
              echo "[DEV] Deploying with ${env.DEV_COMPOSE}"
              docker compose -f ${env.DEV_COMPOSE} up -d --force-recreate --remove-orphans
            """
          } else {
            echo "[DEV] ${env.DEV_COMPOSE} not found. Skipping deploy."
          }
        }
      }
    }

    stage('Deploy PROD (main/master)') {
      when { anyOf { branch 'main'; branch 'master' } }
      steps {
        sh """
          echo "[PROD] Deploying with ${env.PROD_COMPOSE}"
          docker compose -f ${env.PROD_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[PROD] Warm-up & health check..."
          sleep 2
          if [ -x ${env.HEALTH} ]; then
            ${env.HEALTH} || echo "[WARN] Health check failed"
          fi

          curl -s -o /dev/null -w "FRONT / -> %{http_code}\\n" https://zipon.duckdns.org/
          curl -s -o /dev/null -w "BACK /api/ -> %{http_code}\\n" https://zipon.duckdns.org/api/
          curl -s -o /dev/null -w "AI /ai/ -> %{http_code}\\n" https://zipon.duckdns.org/ai/
        """
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline success"
    }
    failure {
      echo "❌ Pipeline failed. Check above logs."
    }
    always {
      sh 'docker image prune -f || true'
    }
  }
}
