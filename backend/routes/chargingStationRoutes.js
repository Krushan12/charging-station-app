const express = require('express');
const { check } = require('express-validator');
const chargingStationController = require('../controllers/chargingStationController');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', chargingStationController.getChargingStations);
router.get('/:id', chargingStationController.getChargingStation);
router.get(
  '/radius/:latitude/:longitude/:distance',
  chargingStationController.getChargingStationsInRadius
);

// Protected routes (require authentication)
router.use(protect);

router.post(
  '/',
  [
    check('name', 'Please add a name').not().isEmpty(),
    check('powerOutput', 'Please include power output in kW').isFloat({ min: 1 }),
    check('connectorType', 'Please include connector type').not().isEmpty().isIn(['Level 1', 'Level 2', 'DC Fast']),
    check('location.type').equals('Point'),
    check('location.coordinates').isArray().custom((coords) => {
      if (!coords || coords.length !== 2) return false;
      const [lng, lat] = coords;
      return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    }).withMessage('Invalid coordinates. Must be [longitude, latitude] pair')
  ],
  chargingStationController.createChargingStation
);

router.put(
  '/:id',
  [
    check('name', 'Please add a name').optional().not().isEmpty(),
    check('latitude', 'Please include valid latitude').optional().isFloat({ min: -90, max: 90 }),
    check('longitude', 'Please include valid longitude').optional().isFloat({ min: -180, max: 180 }),
    check('powerOutput', 'Please include valid power output in kW').optional().isFloat({ min: 1 }),
    check('connectorType', 'Please include valid connector type').optional().not().isEmpty(),
    check('status', 'Please include valid status').optional().isIn(['Active', 'Inactive'])
  ],
  chargingStationController.updateChargingStation
);

router.delete('/:id', chargingStationController.deleteChargingStation);

module.exports = router;