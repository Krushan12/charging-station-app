const ChargingStation = require('../models/ChargingStation');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all charging stations
// @route   GET /api/charging-stations
// @access  Public
exports.getChargingStations = async (req, res, next) => {
  try {
    // Filtering
    let query = {};
    
    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Power output filter (min)
    if (req.query.minPower) {
      query.powerOutput = { $gte: Number(req.query.minPower) };
    }
    
    // Power output filter (max)
    if (req.query.maxPower) {
      query.powerOutput = query.powerOutput || {};
      query.powerOutput.$lte = Number(req.query.maxPower);
    }
    
    // Connector type filter
    if (req.query.connectorType) {
      query.connectorType = req.query.connectorType;
    }

    const chargingStations = await ChargingStation.find(query).populate('createdBy', 'email');
    
    res.status(200).json({
      success: true,
      count: chargingStations.length,
      data: chargingStations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single charging station
// @route   GET /api/charging-stations/:id
// @access  Public
exports.getChargingStation = async (req, res, next) => {
  try {
    const chargingStation = await ChargingStation.findById(req.params.id).populate('createdBy', 'email');
    
    if (!chargingStation) {
      return res.status(404).json({
        success: false,
        error: 'Charging station not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chargingStation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new charging station
// @route   POST /api/charging-stations
// @access  Private
exports.createChargingStation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    // Convert location to GeoJSON Point
    req.body.location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude]
    };
    
    const chargingStation = await ChargingStation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: chargingStation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update charging station
// @route   PUT /api/charging-stations/:id
// @access  Private
exports.updateChargingStation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let chargingStation = await ChargingStation.findById(req.params.id);
    
    if (!chargingStation) {
      return res.status(404).json({
        success: false,
        error: 'Charging station not found'
      });
    }
    
    // Make sure user is the owner
    if (chargingStation.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this charging station'
      });
    }
    
    // Update location if provided
    if (req.body.longitude && req.body.latitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      };
    }
    
    chargingStation = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: chargingStation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete charging station
// @route   DELETE /api/charging-stations/:id
// @access  Private
exports.deleteChargingStation = async (req, res, next) => {
  try {
    const chargingStation = await ChargingStation.findById(req.params.id);
    
    if (!chargingStation) {
      return next(new ErrorResponse('Charging station not found', 404));
    }
    
    if (chargingStation.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this charging station', 401));
    }
    
    await ChargingStation.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get charging stations within a radius
// @route   GET /api/charging-stations/radius/:latitude/:longitude/:distance
// @access  Public
exports.getChargingStationsInRadius = async (req, res, next) => {
  try {
    const { latitude, longitude, distance } = req.params;
    
    // Calculate radius using radians
    // Divide distance by radius of Earth (6,378 km)
    const radius = distance / 6378;
    
    const chargingStations = await ChargingStation.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius]
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: chargingStations.length,
      data: chargingStations
    });
  } catch (err) {
    next(err);
  }
};