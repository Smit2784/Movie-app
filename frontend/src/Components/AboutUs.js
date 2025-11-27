

export const AboutUs = () => {
  const teamMembers = [
    {
      name: "Smit  Dudhat",
      role: "CEO & Founder",
      image:
        "https://cdn.images.express.co.uk/img/dynamic/79/940x/secondary/Paul-is-best-known-for-playing-Arthur-Shelby-5237845.avif?r=1709074164477",
      description:
        "Passionate about revolutionizing the movie experience with 10+ years in entertainment industry.",
    },
    {
      name: "Vineet Gohil",
      role: "CTO",
      image: "https://cdn.webshopapp.com/shops/268192/files/433182622/tommy-shelby.jpg",
      description:
        "Tech enthusiast leading our digital transformation with expertise in web and mobile technologies.",
    },
    {
      name: "Harsh Nakrani",
      role: "Head of Operations",
      image:
        "https://i2-prod.walesonline.co.uk/article23499865.ece/ALTERNATES/s1200f/0_Peaky-Blinders-SERIES-4.jpg",
      description:
        "Ensuring seamless operations across all theaters with focus on customer satisfaction.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              About MovieTix
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to make movie-going magical. From finding the
            perfect show to booking the best seats, we're here to enhance your
            cinematic journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4"></div>
              <span className="text-purple-600 font-semibold uppercase tracking-wide text-sm">
                Our Story
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
              Where Cinema Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Innovation
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Founded in 2020, MovieTix started with a simple belief: booking
              movie tickets shouldn't be complicated. What began as a small
              startup has grown into India's most loved movie booking platform,
              serving millions of movie enthusiasts across the country.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've revolutionized the way people discover, book, and enjoy
              movies by combining cutting-edge technology with a deep
              understanding of what movie lovers truly want.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl p-8 text-white">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black mb-2">5M+</div>
                  <div className="text-purple-100">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">7+</div>
                  <div className="text-purple-100">Theater Partners</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">50+</div>
                  <div className="text-purple-100">Cities Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">10M+</div>
                  <div className="text-purple-100">Tickets Booked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind MovieTix's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-purple-600 font-semibold mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};