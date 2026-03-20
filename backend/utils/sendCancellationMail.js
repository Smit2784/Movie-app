const nodemailer = require("nodemailer");

const sendCancellationMail = async (user, booking) => {
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
        subject: "❌ Booking Cancelled - MovieTix",
        html: `
                <div style="background:#111827;padding:30px;font-family:Arial">
                  <div style="max-width:560px;margin:auto;background:white;border-radius:14px;overflow:hidden">
                
                    <div style="background:#ef4444;color:white;padding:18px;text-align:center">
                      <h2 style="margin:0">Booking Cancelled</h2>
                    </div>
                
                    <div style="padding:22px">
                
                      <div style="border:2px dashed #e5e7eb;border-radius:10px;padding:18px">
                
                        <p style="font-size:18px;font-weight:bold;margin:0 0 10px">${booking.movieTitle}</p>
                
                        <p style="margin:4px 0;color:#555">🏢 ${booking.theatreName}</p>
                        <p style="margin:4px 0;color:#555">⏰ ${booking.showTime}</p>
                        <p style="margin:4px 0;color:#555">💺 ${booking.seats.join(", ")}</p>
                
                        <div style="margin-top:15px;font-size:12px;color:#9ca3af">
                          Booking ID : ${booking._id}
                        </div>
                
                      </div>
                
                      <div style="margin-top:18px;font-size:13px;color:#374151">
                        Any eligible refund will be processed automatically.
                      </div>
                
                    </div>
                
                  </div>
                </div>
               `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendCancellationMail;
