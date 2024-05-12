const {Router} = require('express')

const router = Router()


router.get('/', (req, res) => {
    try {
        const params = req.query

        return res.status(200).json({
            message:'oke',
            params
        })
    } catch (error) {
        return res.status(500).json({
            message:'error',
            error
        })
    }
})

router.get('/:id/data/:name', (req, res) => {
    try {
        const params = req.params

        return res.status(200).json({
            message:'oke',
            params
        })
    } catch (error) {
        return res.status(500).json({
            message:'error',
            error
        })
    }
})
module.exports = router