const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the charging station'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && 
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates. Provide [longitude, latitude]'
      }
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  powerOutput: {
    type: Number,
    required: [true, 'Please provide power output in kW'],
    min: [1, 'Power output must be at least 1 kW']
  },
  connectorType: {
    type: String,
    required: [true, 'Please provide connector type'],
    enum: ['Level 1', 'Level 2', 'DC Fast']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location
chargingStationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ChargingStation', chargingStationSchema);