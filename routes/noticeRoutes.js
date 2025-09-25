const Notice = require('../schema/noticeSchema');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        const allNotices = await Notice.find();
        res.status(200).send(allNotices);
    } catch (error) {
        next(error)
   }
});
router.post('/', async (req, res, next) => {
    const noticeData = req.body;
//   const noticeData = {
//     id: 6,
//     title: "this is a most important notce for everyone.",
//     type: "Ignorable",
//     badge: "info",
//     animation: "IgnoreableJSON",
//     publishDate: "23/2/27 1:23:34PM",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam mollitia, praesentium quas perferendis delectus odio repellat vero magni qui ipsam cumque, quibusdam natus iste maiores tempore dicta, accusantium debitis corrupti.",
//   };
 try {
     const newNotice = new Notice(noticeData);
     const saveNotice = await newNotice.save();
     res.status(201).send(saveNotice);
 } catch (error) {
    next(error)
 }
})

module.exports = router;