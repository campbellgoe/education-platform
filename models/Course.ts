// models/Course.ts
import mongoose, { Document, Model } from 'mongoose';

interface ICourse extends Document {
  title: string;
  slug: string;
  category: string;
  teacherId: mongoose.Types.ObjectId;
  content: string;
  enrolledStudents: mongoose.Types.ObjectId[];
}

const CourseSchema = new mongoose.Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [100, 'Course title cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a teacher for this course'],
  },
  content: {
    type: String,
    required: [true, 'Please provide course content'],
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Add a pre-save hook to generate the slug
CourseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;