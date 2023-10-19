// Created by 21343009_Mukhtarijal
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode")
const forecast = require("./utils/prediksiCuaca")

const app = express();

// Mengatur view engine
app.set("view engine", "hbs");

// Mengatur direktori untuk file statis
const direktoriPublic = path.join(__dirname, "../public");
app.use(express.static(direktoriPublic));

// Mengatur direktori views dan partials untuk Handlebars
const direktoriViews = path.join(__dirname, "../templates/views");
const direktoriPartials = path.join(__dirname, "../templates/partials");

app.set("views", direktoriViews);
hbs.registerPartials(direktoriPartials);

// Halaman utama
app.get("/", (req, res) => {
  res.render("index", {
    judul: "Aplikasi Cek Cuaca",
    nama: "Mukhtarijal",
  });
});

// Halaman bantuan
app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    judul: "Bantuan",
    teksBantuan: "Ini adalah teks bantuan",
    nama: "Mukhtarijal",
  });
});

// Halaman infoCuaca
app.get('/infocuaca', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'Kamu harus memasukan lokasi yang ingin dicari'
    });
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, dataPrediksi) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        prediksiCuaca: dataPrediksi,
        lokasi: location,
        address: req.query.address
      });
    });
  });
});

// Halaman tentang
app.get("/tentang", (req, res) => {
  res.render("tentang", {
    judul: "Tentang Saya",
    nama: "Mukhtarijal",
  });
});

// Halaman bantuan (Wildcard route)
app.get("/bantuan/*", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Mukhtarijal",
    pesanKesalahan: "Artikel yang dicari tidak ditemukan!",
  });
});

// Wildcard route (kesalahan)
app.get("*", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Mukhtarijal",
    pesanKesalahan: "Halaman tidak ditemukan!",
  });
});

// Menjalankan server pada port 4000
app.listen(4000, () => {
  console.log("Server berjalan pada port 4000.");
});
