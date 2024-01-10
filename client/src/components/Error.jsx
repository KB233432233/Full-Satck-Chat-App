import { Alert } from 'reactstrap'

function Error({ error }) {
    return (
        <div>
            {
                error ?
                    (
                        <Alert color='danger'>
                            {error}
                        </Alert>
                    )
                    : ''
            }
        </div>
    )


}

export default Error
