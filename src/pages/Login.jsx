import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันการส่งฟอร์มโดยอัตโนมัติ

    if (username === "") {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด !",
        text: "กรุณากรอกชื่อผู้ใช้",
        focusConfirm: false,
        allowOutsideClick: false,
      }).then(() => {
        const usernameInput = document.getElementById("username");
        if (usernameInput) {
          usernameInput.focus();
        }
      });
      return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }

    if (password === "") {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด !",
        text: "กรุณากรอกรหัสผ่าน",
        focusConfirm: false,
        allowOutsideClick: false,
      }).then(() => {
        const passwordInput = document.getElementById("password");
        if (passwordInput) {
          passwordInput.focus();
        }
      });
      return;
    }

    // การส่งคำขอ API
    try {
      const response = await axios.post(
        "http://192.168.1.150/checklogin",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "d40bdb46ce299d946999642a26cad2d8",
          },
        }
      );

      if (response.data.status === 200) {
        sessionStorage.setItem(
          "userSession",
          JSON.stringify(response.data.data[0])
        );
        await Toast.fire({
          icon: "success",
          title: "ล็อคอินสำเร็จ",
        });
        window.location.href = "/";
      } else {
        await Toast.fire({
          icon: "error",
          title: "Username หรือ Password ไม่ถูกต้อง!",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      });
    }
  };

  return (
    <main className="flex justify-center items-center font-[sans-serif] h-full min-h-screen p-4 bg-[url('./src/images/background.png')] bg-cover bg-center">
      <div className="max-w-md w-full mx-auto drop-shadow-2xl">
        <form
          onSubmit={handleLogin}
          className=" bg-[#FFFFFF] rounded-2xl p-6 font-LexendDeca"
        >
          <div className="flex flex-col gap-14">
            <h3 className="text-[#7D5E3F] text-3xl font-bold text-center">
              Sign in
            </h3>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-circle text-[#B6A28E]"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                  <label htmlFor="username">Username</label>
                </div>
                <input
                  name="username"
                  type="text"
                  className="w-full text-sm text-gray-800 border-b-2 border-t-0 border-l-0 border-r-0 border-[#BBBFCA] focus:border-orange-500 focus:outline-none focus:ring-0 px-2 py-3 placeholder:text-gray-400"
                  placeholder="Enter your username.."
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-lock-fill text-[#B6A28E]"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                  </svg>
                  <label htmlFor="password">Password</label>
                </div>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password.."
                    className="w-full text-sm text-gray-800 border-b-2 border-t-0 border-l-0 border-r-0 border-[#BBBFCA] focus:border-orange-500 focus:outline-none focus:ring-0 px-2 py-3 placeholder:text-gray-400"
                    id="password"
                    autoComplete="off"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye-slash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-[#FF4D00] to-[#FFC002] hover:from-pink-500 hover:via-orange-500 hover:to-orange-600 active:bg-orange-700 focus:ring focus:ring-orange-300 flex flex-row justify-center w-full gap-2 h-auto py-3 px-10 text-sm font-semibold tracking-wider rounded-full text-white bg-[#f16a2b] hover:bg-[#f16a2b] focus:outline-none"
            >
              Sign in
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                fill="currentColor"
                className="bi bi-box-arrow-in-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
