pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Monika8sv/StockEase.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'chmod +x mvnw'
                sh './mvnw clean package -DskipTests'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t stockease-backend:${BUILD_NUMBER} -t stockease-backend:latest .'
                sh 'docker build -t stockease-frontend:${BUILD_NUMBER} -t stockease-frontend:latest ./frontend'
            }
        }
    }
}
