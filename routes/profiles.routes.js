const Router = require('express');
const Profile = require('../models/Profile.js');
const authCheck = require('../middlewares/auth.middleware.js');

const router = new Router();

router.get(
    '/',
    authCheck,
    async (req, res) => {
      try {
        const profiles = await Profile.find();
        res.json(profiles);
      } catch (error) {
        res
            .send(500)
            .json({message: 'Профили не найдены'});
      }
    },
);

router.get(
    '/:userEmail',
    authCheck,
    async (req, res) => {
      try {
        const userProfiles = await Profile.find({owner: req.params.userEmail});
        console.log('profiles: ', userProfiles);

        res.json(userProfiles);
      } catch (error) {
        res
            .send(500)
            .json({message: 'Профили не найдены'});
      }
    },
);

router.put(
    '/update/:id',
    authCheck,
    async (req, res) => {
      try {
        console.log(req.body);
        console.log(req.params.id);
        const profileId = req.params.id;

        await Profile.updateOne({_id: profileId}, req.body);

        res.json({
          status: 200,
          message: 'Профиль создан',
        });
      } catch (error) {
        res
            .send(500)
            .json({message: 'Профили не создан'});
      }
    },
);

router.delete(
    '/delete/:id',
    authCheck,
    async (req, res) => {
      try {
        const {isUserAdmin} = req.body;
        if (!isUserAdmin) {
          return res.status(401).json({
            message: 'Вы не админ',
          });
        }

        const profileId = req.params.id;

        await Profile.deleteOne({_id: profileId});
        res.json({
          status: 200,
          message: 'Профиль удалён',
        });
      } catch (error) {
        res
            .send(500)
            .json({message: 'Профили не найдены'});
      }
    },
);

router.post(
    '/add',
    authCheck,
    async (req, res) => {
      try {
        const newProfile = new Profile(req.body);

        await newProfile.save();

        res.json({
          status: 200,
          message: 'Профиль создан',
        });
      } catch (error) {
        res
            .send(500)
            .json({message: 'Профили не создан'});
      }
    },
);

module.exports = router;
