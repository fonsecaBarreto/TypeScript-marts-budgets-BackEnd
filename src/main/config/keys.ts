import { config } from 'dotenv'
config()

export default {
    node_env: process.env.NODE_ENV || 'test',
    port: process.env.PORT || 9000,
    react_client: process.env.REACT_CLIENT,
    jwt_secret: process.env.JWT_ECRET || 'test_secret',
    email_address: process.env.EMAIL_ADDRESS,
    email_password: process.env.EMAIL_PASSWORD,
}

