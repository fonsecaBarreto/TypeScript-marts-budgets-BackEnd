import { config } from 'dotenv'
config()

export default {//'contato@unacompras.com.br'
    node_env: process.env.NODE_ENV || 'test',
    port: process.env.PORT || 9000,
    jwt_secret: process.env.JWT_ECRET || 'test_secret',
    hook_email: process.env.HOOK_EMAIL,
    react_client: process.env.REACT_CLIENT,
    email_address: process.env.EMAIL_ADDRESS,
    email_password: process.env.EMAIL_PASSWORD,
    aws_uploads_bucket: process.env.AWS_UPLOADS_BUCKET, 
    aws_access_key: process.env.AWS_ACCESS_KEY, 
    aws_secret_key: process.env.AWS_SECRET_KEY, 
    aws_region: process.env.AWS_REGION
}

