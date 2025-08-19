const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  serviceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  node: {
    type: String,
    trim: true,
  },
  issue: {
    type: String,
    trim: true,
  },
  remark: {
    type: String,
    trim: true,
  },
  openDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  closedDate: {
    type: Date,
  },
  responsePersonMobitel: {
    type: String,
    trim: true,
  },
  responsePersonHuawei: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open',
  },
  rcaFilePath: {
    type: String,
  },
  description: {
    type: String,
  },
  workAroundRectification: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for better query performance
//serviceRequestSchema.index({ serviceNumber: 1 });
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
