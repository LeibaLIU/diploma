pipeline {
    agent any

    parameters {
        choice(
            name: 'TESTS',
            choices: ['all', 'ui', 'api', 'mobile', 'smoke'],
            description: 'Какой набор тестов запускать'
        )
        string(
            name: 'BASE_URL',
            defaultValue: 'https://demowebshop.tricentis.com',
            description: 'Адрес тестируемого приложения'
        )
        string(
            name: 'ALLURE_PROJECT_ID',
            defaultValue: '5182',
            description: 'ID проекта в Allure TestOps (если пусто — отчёт в TestOps не загружается)'
        )
    }

    environment {
        // Allure TestOps configuration. Токен лежит в Jenkins Credentials.
        ALLURE_ENDPOINT = 'https://allure.autotests.cloud'
        ALLURE_RESULTS  = 'allure-results'
        // Лейблы запуска для красивого отображения в TestOps.
        ALLURE_LAUNCH_NAME = "diploma · ${params.TESTS} · #${BUILD_NUMBER}"
        ALLURE_LAUNCH_TAGS = "ci:jenkins,build:${BUILD_NUMBER}"
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Install Node.js') {
            steps {
                sh '''
                    set -e
                    if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v\\([0-9]*\\).*/\\1/')" -lt 20 ]; then
                        echo "Installing Node.js 20 via nvm..."
                        export NVM_DIR="$HOME/.nvm"
                        if [ ! -s "$NVM_DIR/nvm.sh" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        fi
                        . "$NVM_DIR/nvm.sh"
                        nvm install 20
                        nvm use 20
                        ln -sf "$(which node)" /tmp/node
                        ln -sf "$(which npm)"  /tmp/npm
                        ln -sf "$(which npx)"  /tmp/npx
                    fi
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                    set -e
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 20 || true
                    npm ci || npm install
                    npx playwright install --with-deps chromium
                '''
            }
        }

        stage('Run tests') {
            steps {
                script {
                    def cmd = [
                        'all'   : 'npm test',
                        'ui'    : 'npm run test:ui',
                        'api'   : 'npm run test:api',
                        'mobile': 'npm run test:mobile',
                        'smoke' : 'npm run test:smoke'
                    ][params.TESTS] ?: 'npm test'

                    // Не падаем сразу — даём возможность опубликовать отчёт.
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                        sh """
                            set -e
                            export NVM_DIR="\$HOME/.nvm"
                            [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh" && nvm use 20 || true
                            export CI=true
                            export BASE_URL='${params.BASE_URL}'
                            ${cmd}
                        """
                    }
                }
            }
        }

        stage('Upload to Allure TestOps') {
            when { expression { return params.ALLURE_PROJECT_ID?.trim() } }
            steps {
                withCredentials([
                    string(credentialsId: 'ALLURE_TOKEN', variable: 'ALLURE_TOKEN')
                ]) {
                    sh '''
                        set -e
                        if ! command -v allurectl >/dev/null 2>&1; then
                            curl -sSL https://github.com/allure-framework/allurectl/releases/latest/download/allurectl_linux_amd64 \
                                -o /tmp/allurectl
                            chmod +x /tmp/allurectl
                            export PATH="/tmp:$PATH"
                        fi

                        allurectl upload \
                            --endpoint   "$ALLURE_ENDPOINT" \
                            --token      "$ALLURE_TOKEN" \
                            --project-id "''' + params.ALLURE_PROJECT_ID + '''" \
                            --launch-name "$ALLURE_LAUNCH_NAME" \
                            --launch-tags "$ALLURE_LAUNCH_TAGS" \
                            "$ALLURE_RESULTS" || echo "TestOps upload skipped"
                    '''
                }
            }
        }
    }

    post {
        always {
            // Allure-report плагин Jenkins построит HTML из allure-results.
            allure([
                includeProperties: false,
                jdk: '',
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])

            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-results/**',     allowEmptyArchive: true
        }

        success {
            echo "✅ Build #${BUILD_NUMBER} (${params.TESTS}) passed"
        }
        unstable {
            echo "⚠️  Build #${BUILD_NUMBER} (${params.TESTS}) has failing tests — see Allure"
        }
        failure {
            echo "❌ Build #${BUILD_NUMBER} (${params.TESTS}) failed before tests"
        }
    }
}
