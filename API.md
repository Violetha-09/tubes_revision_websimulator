# Dokumentasi REST API - World Cup 2026 Simulator

Dokumen ini menyediakan rincian lengkap mengenai spesifikasi REST API yang dikembangkan pada backend aplikasi World Cup 2026 Simulator. Seluruh request dan response bertipe data `application/json`.

---

## 1. Kelompok: Teams

### GET /api/teams
* **Method**: `GET`
* **URL**: `/api/teams`
* **Deskripsi**: Mengambil seluruh daftar tim nasional peserta Piala Dunia dari database.
* **Path Parameter**: Tidak ada
* **Query Parameter**: Tidak ada
* **Response Success**: `200 OK` (Mengembalikan array objek tim)
* **Response Error**: `500 Internal Server Error` (Error koneksi database)
* **Contoh Request JSON**: *N/A (GET Request)*
* **Contoh Response JSON**:
  ```json
  [
    {
      "id": "MEX",
      "name": "Mexico",
      "code": "MEX",
      "group": "A",
      "flag": "🇲🇽",
      "createdAt": "2026-07-05T09:07:53.192Z",
      "updatedAt": "2026-07-05T09:07:53.192Z"
    },
    {
      "id": "JPN",
      "name": "Japan",
      "code": "JPN",
      "group": "A",
      "flag": "🇯🇵",
      "createdAt": "2026-07-05T09:07:53.192Z",
      "updatedAt": "2026-07-05T09:07:53.192Z"
    }
  ]
  ```

---

### POST /api/teams
* **Method**: `POST`
* **URL**: `/api/teams`
* **Deskripsi**: Menambahkan data tim nasional baru ke dalam database.
* **Path Parameter**: Tidak ada
* **Query Parameter**: Tidak ada
* **Request Body**:
  * `code` (String, required): Kode 3 huruf tim (contoh: `"IDN"`).
  * `name` (String, required): Nama negara (contoh: `"Indonesia"`).
  * `group` (String, required): Grup babak penyisihan (A - L) (contoh: `"A"`).
  * `flag` (String, required): Emoji bendera negara (contoh: `"🇮🇩"`).
* **Response Success**: `200 OK`
* **Response Error**: 
  * `400 Bad Request` (Payload tidak lengkap)
  * `500 Internal Server Error` (Kode negara duplikat atau error database)
* **Contoh Request JSON**:
  ```json
  {
    "code": "IDN",
    "name": "Indonesia",
    "group": "A",
    "flag": "🇮🇩"
  }
  ```
* **Contoh Response JSON**:
  ```json
  {
    "message": "Team added successfully",
    "team": {
      "id": "IDN",
      "name": "Indonesia",
      "code": "IDN",
      "group": "A",
      "flag": "🇮🇩",
      "createdAt": "2026-07-05T11:40:00.000Z",
      "updatedAt": "2026-07-05T11:40:00.000Z"
    }
  }
  ```

---

### PUT /api/teams/:code
* **Method**: `PUT`
* **URL**: `/api/teams/:code`
* **Deskripsi**: Memperbarui informasi data negara tertentu berdasarkan kode negara.
* **Path Parameter**:
  * `code` (String): Kode 3 huruf tim yang ingin diubah (contoh: `IDN`).
* **Query Parameter**: Tidak ada
* **Request Body**:
  * `name` (String, required): Nama negara baru.
  * `group` (String, required): Grup babak penyisihan baru.
  * `flag` (String, required): Emoji bendera negara baru.
* **Response Success**: `200 OK`
* **Response Error**:
  * `400 Bad Request` (Payload tidak lengkap)
  * `500 Internal Server Error` (Tim tidak ditemukan atau error database)
* **Contoh Request JSON**:
  ```json
  {
    "name": "Indonesia Raya",
    "group": "B",
    "flag": "🇮🇩"
  }
  ```
* **Contoh Response JSON**:
  ```json
  {
    "message": "Team updated successfully",
    "team": {
      "id": "IDN",
      "name": "Indonesia Raya",
      "code": "IDN",
      "group": "B",
      "flag": "🇮🇩",
      "createdAt": "2026-07-05T11:40:00.000Z",
      "updatedAt": "2026-07-05T11:42:00.000Z"
    }
  }
  ```

---

### DELETE /api/teams/:code
* **Method**: `DELETE`
* **URL**: `/api/teams/:code`
* **Deskripsi**: Menghapus tim nasional tertentu berdasarkan kode negaranya dari database.
* **Path Parameter**:
  * `code` (String): Kode negara tim yang akan dihapus.
* **Query Parameter**: Tidak ada
* **Request Body**: Tidak ada
* **Response Success**: `200 OK`
* **Response Error**: `500 Internal Server Error` (Tim tidak ditemukan atau terikat relasi)
* **Contoh Request JSON**: *N/A (DELETE Request)*
* **Contoh Response JSON**:
  ```json
  {
    "message": "Team deleted successfully"
  }
  ```

---

## 2. Kelompok: Matches

### GET /api/matches
* **Method**: `GET`
* **URL**: `/api/matches`
* **Deskripsi**: Mengambil seluruh jadwal pertandingan penyisihan grup dan babak gugur.
* **Path Parameter**: Tidak ada
* **Query Parameter**:
  * `group` (String, optional): Filter pertandingan berdasarkan grup (contoh: `?group=A`).
  * `status` (String, optional): Filter berdasarkan status pertandingan (contoh: `?status=finished`).
* **Response Success**: `200 OK` (Mengembalikan array objek pertandingan)
* **Response Error**: `500 Internal Server Error`
* **Contoh Request JSON**: *N/A (GET Request)*
* **Contoh Response JSON**:
  ```json
  [
    {
      "id": "G-2",
      "type": "group",
      "group": "A",
      "round": null,
      "name": null,
      "homeTeam": "RSA",
      "awayTeam": "CZE",
      "homeScore": 3,
      "awayScore": 2,
      "status": "finished",
      "nextMatchId": null,
      "isHomeInNextMatch": null,
      "placeholderHome": null,
      "placeholderAway": null,
      "winner": null,
      "penaltyWinner": null,
      "stadium": "MetLife Stadium, East Rutherford",
      "date": "Jun 11, 2026",
      "kickoff": "21:00",
      "createdAt": "2026-07-05T09:54:04.850Z",
      "updatedAt": "2026-07-05T10:00:51.705Z"
    }
  ]
  ```

---

### PUT /api/matches/:id
* **Method**: `PUT`
* **URL**: `/api/matches/:id`
* **Deskripsi**: Memperbarui skor, status, dan informasi detail jadwal dari suatu pertandingan spesifik.
* **Path Parameter**:
  * `id` (String): ID pertandingan yang diubah (contoh: `G-2` atau `R32-1`).
* **Query Parameter**: Tidak ada
* **Request Body**:
  * `homeScore` (Int, optional): Jumlah gol tim kandang.
  * `awayScore` (Int, optional): Jumlah gol tim tandang.
  * `status` (String, required): Status laga (`scheduled`, `live`, `finished`).
  * `stadium` (String, optional): Nama stadion lokasi tanding.
  * `date` (String, optional): Tanggal pertandingan.
  * `kickoff` (String, optional): Jam tanding.
  * `penaltyWinner` (String, optional): Pemenang adu penalti jika skor di fase gugur berakhir imbang (contoh: `"ESP"`).
* **Response Success**: `200 OK` (Mengembalikan pesan sukses serta array lengkap seluruh pertandingan terbaru untuk sinkronisasi instan).
* **Response Error**: 
  * `500 Internal Server Error` (Pertandingan tidak ditemukan / ID tidak cocok)
* **Contoh Request JSON**:
  ```json
  {
    "homeScore": 3,
    "awayScore": 2,
    "status": "finished",
    "stadium": "MetLife Stadium, East Rutherford",
    "date": "Jun 11, 2026",
    "kickoff": "21:00"
  }
  ```
* **Contoh Response JSON**:
  ```json
  {
    "message": "Match G-2 updated successfully",
    "matches": [
      {
        "id": "G-2",
        "type": "group",
        "group": "A",
        "homeTeam": "RSA",
        "awayTeam": "CZE",
        "homeScore": 3,
        "awayScore": 2,
        "status": "finished",
        "stadium": "MetLife Stadium, East Rutherford",
        "date": "Jun 11, 2026",
        "kickoff": "21:00",
        "createdAt": "2026-07-05T09:54:04.850Z",
        "updatedAt": "2026-07-05T10:00:51.705Z"
      }
    ]
  }
  ```

---

### POST /api/matches/reset
* **Method**: `POST`
* **URL**: `/api/matches/reset`
* **Deskripsi**: Menghapus semua riwayat klasemen, skor, dan hasil bagan fase gugur di database dan mengembalikannya ke kondisi awal bersih.
* **Path Parameter**: Tidak ada
* **Query Parameter**: Tidak ada
* **Request Body**: Tidak ada
* **Response Success**: `200 OK` (Mengembalikan daftar pertandingan bersih)
* **Response Error**: `500 Internal Server Error`
* **Contoh Request JSON**: *N/A (POST Request)*
* **Contoh Response JSON**:
  ```json
  {
    "message": "Tournament reset successfully",
    "matches": [
      {
        "id": "G-1",
        "type": "group",
        "group": "A",
        "homeTeam": "MEX",
        "awayTeam": "JPN",
        "homeScore": null,
        "awayScore": null,
        "status": "scheduled"
      }
    ]
  }
  ```

---

### POST /api/matches/simulate-group
* **Method**: `POST`
* **URL**: `/api/matches/simulate-group`
* **Deskripsi**: Mensimulasikan hasil gol acak pada seluruh laga fase penyisihan grup yang belum dimainkan secara massal.
* **Path Parameter**: Tidak ada
* **Query Parameter**: Tidak ada
* **Request Body**: Tidak ada
* **Response Success**: `200 OK` (Mengembalikan daftar pertandingan terupdate)
* **Response Error**: `500 Internal Server Error`
* **Contoh Request JSON**: *N/A (POST Request)*
* **Contoh Response JSON**:
  ```json
  {
    "message": "Group stage simulated successfully",
    "matches": [
      {
        "id": "G-1",
        "type": "group",
        "group": "A",
        "homeTeam": "MEX",
        "awayTeam": "JPN",
        "homeScore": 3,
        "awayScore": 1,
        "status": "finished"
      }
    ]
  }
  ```

---

### POST /api/matches/advance-knockout
* **Method**: `POST`
* **URL**: `/api/matches/advance-knockout`
* **Deskripsi**: Menghitung klasemen akhir grup untuk meloloskan peringkat 1 dan 2 dari 12 grup serta 8 peringkat 3 terbaik, lalu menyusun laga bagan Round of 32 di database.
* **Path Parameter**: Tidak ada
* **Query Parameter**: Tidak ada
* **Request Body**: Tidak ada
* **Response Success**: `200 OK` (Mengembalikan seluruh bagan yang terupdate)
* **Response Error**: `500 Internal Server Error`
* **Contoh Request JSON**: *N/A (POST Request)*
* **Contoh Response JSON**:
  ```json
  {
    "message": "Advanced to knockout stage successfully",
    "matches": [
      {
        "id": "R32-1",
        "type": "knockout",
        "round": "R32",
        "name": "Round of 32",
        "homeTeam": "MEX",
        "awayTeam": "BRA",
        "homeScore": null,
        "awayScore": null,
        "status": "scheduled"
      }
    ]
  }
  ```


