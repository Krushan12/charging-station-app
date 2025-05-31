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
  try {
    console.log('Received data:', req.body);
    
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array().map(err => err.msg).join(', ')
      });
    }
    
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    // Format the data with explicit type conversions
    const formattedData = {
      name: req.body.name,
      powerOutput: Number(req.body.powerOutput),
      connectorType: req.body.connectorType,
      status: req.body.status || 'available',
      location: {
        type: 'Point',
        coordinates: req.body.location.coordinates.map(Number)
      },
      createdBy: req.user.id
    };
    
    console.log('Formatted data:', formattedData);
    
    const chargingStation = await ChargingStation.create(formattedData);
    
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
  try {
    // Basic validation
    if (!req.body.name || !req.body.powerOutput || !req.body.connectorType || !req.body.status) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Please provide all required fields' }]
      });
    }

    // Validate power output
    const powerOutput = Number(req.body.powerOutput);
    if (isNaN(powerOutput) || powerOutput < 1) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'powerOutput', msg: 'Power output must be at least 1 kW' }]
      });
    }

    // Validate location
    if (!req.body.location || 
        (req.body.location.type !== 'text' && 
         (!req.body.location.coordinates || req.body.location.coordinates.length !== 2))) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'location', msg: 'Invalid location format' }]
      });
    }

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
    
    // Format the update data
    let updateData = {
      ...req.body,
      powerOutput: Number(req.body.powerOutput),
      pricePerHour: Number(req.body.pricePerHour || 0),
      location: {
        type: 'Point',
        coordinates: [
          Number(req.body.location.coordinates[0]) || 0,
          Number(req.body.location.coordinates[1]) || 0
        ]
      }
    };

    // Handle text location if provided
    if (req.body.locationText) {
      updateData.locationText = req.body.locationText;
    }
    
    chargingStation = await ChargingStation.findByIdAndUpdate(req.params.id, updateData, {
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