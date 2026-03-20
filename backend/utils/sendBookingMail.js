const nodemailer = require("nodemailer");

const sendBookingMail = async (user, booking) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"MovieTix" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "🎬 Booking Confirmation - MovieTix",
        html: `
                <div style="background:linear-gradient(135deg,#1f2937,#020617);padding:35px;font-family:Arial">
                  <div style="max-width:600px;margin:auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3)">
                
                    <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:26px;text-align:center;color:white">
                      <div style="font-size:44px">🍿</div>
                      <h2 style="margin:10px 0 0">Your Ticket is Booked</h2>
                    </div>
                
                    <div style="padding:30px">
                
                      <h3 style="margin-top:0;color:#111">Hi ${user.name},</h3>
                      <p style="color:#555;font-size:15px">
                        Your booking is confirmed. Get ready for an amazing movie experience.
                      </p>
                
                      <div style="margin-top:20px;background:#f9fafb;border-radius:12px;padding:20px">
                
                        <p style="margin:6px 0"><b>Movie:</b> ${booking.movieTitle}</p>
                        <p style="margin:6px 0"><b>Theatre:</b> ${booking.theatreName}</p>
                        <p style="margin:6px 0"><b>Show Time:</b> ${booking.showTime}</p>
                        <p style="margin:6px 0"><b>Seats:</b> ${booking.seats.join(", ")}</p>
                        <p style="margin:6px 0"><b>Amount:</b> ₹${booking.totalAmount}</p>
                
                      </div>
                
                      <div style="margin-top:22px;background:#dcfce7;color:#166534;padding:14px;border-radius:10px;font-size:13px">
                        Show this email at theatre entry if required.
                      </div>
                
                    </div>
                
                    <div style="background:#020617;color:#9ca3af;text-align:center;padding:14px;font-size:12px">
                      MovieTix • Experience Movies Better
                    </div>
                
                  </div>
                </div>
              `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendBookingMail;
