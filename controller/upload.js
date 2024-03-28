exports.upload = (req, res, next) => {
    try {
        res.status(200).json({
            code: 200,
            msg: "上传成功",
            data: "http://127.0.0.1:5000/" + "upload/" + req.file.originalname
        })
    } catch (err) {
        next(err)
    }
}