import { Users } from "../models/auth-model.js";
import { LoginService, RegisterServices, resetPasswordService, sendResetEmail, serviceGetUser } from "../services/auth-service.js";
import { refreshTokenServise } from "../services/auth-service.js";

export const getUser = async (request, h) => {
  const response = await serviceGetUser();
  return h.response({
    status: 'success',
    data: response
  }).code(200);
};

export const Register = async (request, h) => {
  try {
    const { name, email, password, confPassword } = request.payload;
    const response = await RegisterServices(name, email, password, confPassword);

    return h.response({
      status: "success",
      msg: "Registrasi Berhasil",
      data: response
    }).code(201);
  } catch (error) {
    console.error("Register error:", error.message);
    return h.response({
      status: "fail",
      msg: error.message
    }).code(400);
  }
}

export const Login = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const { refreshToken, accessToken, roles } = await LoginService(email, password);

    return h.response({ accessToken, roles }).state("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    }).code(200);
  } catch (error) {
    return h.response({ msg: error.message }).code(400);
  }
};

export const Logout = async (request, h) => {
  const refreshToken = request.state.refreshToken;

  try {
    if (!refreshToken) {
      return h.response().code(204);
    }

    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken
      }
    })

    if (!user) {
      return h.response().code(204);
    }

    await Users.update({ refresh_token: null }, {
      where: {
        id: user.id
      }
    })
    return h.response({
      status: "success",
      message: "Berhasil Logout"
    }).code(200).unstate('refreshToken');
  } catch (err) {
    return h.response({
      status: "fail",
      message: err.message
    }).code(500);
  }
}



export const refreshToken = async (request, h) => {
  const refreshToken = request.state.refreshToken;
  if (!refreshToken) {
    return h.response({ message: "Unauthorized" }).code(401);
  }

  try {
    const accessToken = await refreshTokenServise(refreshToken);
    return h.response({ accessToken });
  } catch (error) {
    return h.response({ message: error.message }).code(403);
  }
};


export const requestPasswordReset = async (request, h) => {
  try {
    const { email } = request.payload;

    await sendResetEmail(email); // generate token & kirim email

    return h.response({
      status: 'success',
      message: 'Link reset password sudah dikirim ke email Anda.'
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message
    }).code(400);
  }
};

export const resetPassword = async (request, h) => {
  try {
    const { token } = request.params;
    const { newPassword } = request.payload;

    if (!newPassword || newPassword.trim() === '') {
      return h.response({
        status: 'fail',
        message: 'Password baru tidak boleh kosong.'
      }).code(400);
    }

    await resetPasswordService(token, newPassword);

    return h.response({
      status: 'success',
      message: 'Password berhasil diubah.'
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message
    }).code(400);
  }
};
