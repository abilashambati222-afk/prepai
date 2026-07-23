const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const InterviewIntegrity = require('../models/InterviewIntegrity');

const RETENTION_DAYS = 30;
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

const cleanup = async () => {
  try {
    const dbUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/prepai';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB for storage cleanup.');

    const integrities = await InterviewIntegrity.find({
      'evidenceClips.timestamp': { $lt: cutoffDate }
    });

    console.log(`Found ${integrities.length} integrity records with candidates' clips older than ${RETENTION_DAYS} days.`);

    let deletedFilesCount = 0;

    for (const integrity of integrities) {
      let modified = false;

      for (const clip of integrity.evidenceClips) {
        if (clip.timestamp < cutoffDate && clip.videoPath) {
          // Resolve video filename and filepath
          const videoFilename = path.basename(clip.videoPath);
          const videoFilepath = path.join(__dirname, '../uploads', videoFilename);

          if (fs.existsSync(videoFilepath)) {
            try {
              fs.unlinkSync(videoFilepath);
              deletedFilesCount++;
            } catch (fsErr) {
              console.warn(`Could not delete file ${videoFilepath}:`, fsErr.message);
            }
          }

          // Resolve thumbnail filename and filepath
          if (clip.thumbnailPath) {
            const thumbFilename = path.basename(clip.thumbnailPath);
            const thumbFilepath = path.join(__dirname, '../uploads', thumbFilename);
            if (fs.existsSync(thumbFilepath)) {
              try {
                fs.unlinkSync(thumbFilepath);
              } catch (fsErr) {
                console.warn(`Could not delete thumbnail ${thumbFilepath}:`, fsErr.message);
              }
            }
          }

          // Retain metadata log but null out paths to reclaim storage space
          clip.videoPath = '';
          clip.thumbnailPath = '';
          modified = true;
        }
      }

      if (modified) {
        await integrity.save();
      }
    }

    console.log(`Cleanup completed successfully. Deleted ${deletedFilesCount} evidence files.`);
    process.exit(0);
  } catch (err) {
    console.error('Evidence storage cleanup run exception:', err);
    process.exit(1);
  }
};

cleanup();
