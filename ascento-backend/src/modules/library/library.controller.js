const service = require('./library.service');

const add = async (req, res, next) => { try { res.status(201).json(await service.addBook(req.body)); } catch (err) { next(err); } };
const issue = async (req, res, next) => { try { res.json(await service.issueBook(req.body)); } catch (err) { next(err); } };
const returnBook = async (req, res, next) => { try { res.json(await service.returnBook(req.params.id)); } catch (err) { next(err); } };
const list = async (req, res, next) => { try { const { page, limit } = req.query; res.json(await service.listBooks({ page: Number(page)||1, limit: Number(limit)||20 })); } catch (err) { next(err); } };

module.exports = { add, issue, returnBook, list };
