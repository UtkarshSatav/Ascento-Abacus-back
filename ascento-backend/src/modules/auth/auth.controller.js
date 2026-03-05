const authService = require('./auth.service');

const login = async (req, res, next) => {
  try {
    const { role, identifier, password } = req.body;
    const data = await authService.login({ role, identifier, password });
    res.json({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

const seed = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const admin = await authService.seedAdmin({ fullName, email, password });
    res.json(admin);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout, seed };
