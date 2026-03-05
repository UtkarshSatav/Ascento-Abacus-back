const Book = require('../../models/book.model');
const Issue = require('../../models/issue.model');

const addBook = async (data) => Book.create(data);
const issueBook = async ({ bookId, studentId, dueAt }) => {
  const book = await Book.findById(bookId);
  if (!book) throw { status: 404, message: 'Book not found' };
  if (book.copies < 1) throw { status: 400, message: 'No copies available' };
  book.copies -= 1; await book.save();
  return Issue.create({ bookId, studentId, dueAt });
};

const returnBook = async (issueId) => {
  const issue = await Issue.findById(issueId);
  if (!issue) throw { status: 404, message: 'Issue not found' };
  if (issue.returnedAt) throw { status: 400, message: 'Already returned' };
  issue.returnedAt = new Date(); await issue.save();
  const book = await Book.findById(issue.bookId);
  book.copies += 1; await book.save();
  return issue;
};

const listBooks = async ({ page=1, limit=20 }) => { const skip=(page-1)*limit; const docs=await Book.find().skip(skip).limit(limit); const total=await Book.countDocuments(); return { docs, total, page, limit }; };

module.exports = { addBook, issueBook, returnBook, listBooks };
