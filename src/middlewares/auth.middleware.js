import jwt from 'jsonwebtoken'

export const authMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        const authHeaders = req.headers['authorization']
        const accessToken = authHeaders ? authHeaders.split(' ',)[1] : undefined
        if(!accessToken){
            return res.status(401).json({ message: 'Unauthorized' })
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.TOKEN_ACCESS_KEY)
            req.userId = decoded.userId
            req.userRole = decoded.userRole
            if(!allowedRoles.includes(req.userRole)){
                return res.status(403).json({ message: 'Forbidden' })
            }
            next()
        } catch (error) {
            return res.status(403).json({ error: "Invalid or expired token." })
        }
    }
}