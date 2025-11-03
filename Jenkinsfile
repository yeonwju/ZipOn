pipeline {
  agent any

  environment {
    DOCKER_OPTS   = "--pull"
    HEALTH        = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.service.yml"  // compose 프로젝트명 고정 (컨테이너 prefix 정렬)
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '30'))
    disableConcurrentBuilds() 
    // timestamps() 
    timeout(time: 30, unit: 'MINUTES')
  }

  stages {

    stage('Checkout') {
      when { anyOf { branch 'main'; branch 'master' } } 
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .gitsha'
      }
    }

    stage('Build Images') {
      when { anyOf { branch 'main'; branch 'master' } }
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

    stage('Deploy PROD') {
      when { anyOf { branch 'main'; branch 'master' } }
      steps {
        sh """
          set -e

          echo "[PROD] Deploying with ${env.PROD_COMPOSE} (project: ${env.PROJECT_NAME})"
          docker compose -p ${env.PROJECT_NAME} -f ${env.PROD_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[PROD] Warm-up & health check..."
          sleep 3

          if [ -x ${env.HEALTH} ]; then
            if ! ${env.HEALTH}; then
              echo "[WARN] Health script reported issues"; fi
          fi

          # 간단 스모크
          curl -s -o /dev/null -w "FRONT / -> %{http_code}\\n" https://zipon.duckdns.org/
          curl -s -o /dev/null -w "BACK /api/ -> %{http_code}\\n" https://zipon.duckdns.org/api/
          curl -s -o /dev/null -w "AI /ai/ -> %{http_code}\\n" https://zipon.duckdns.org/ai/
        """
      }
    }
  }

  post {
    success {
      echo "✅ PROD deploy success"
      sh 'docker image prune -f || true'
    }
    failure {
      echo "❌ PROD deploy failed — check logs above."
    }
    always {
      echo "ℹ️ finished: ${currentBuild.currentResult}"
    }
  }
}
