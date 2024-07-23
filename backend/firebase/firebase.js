const admin = require('firebase-admin');
const { credential } = admin;

const cred = {
  "type": "service_account",
  "project_id": "mindmaple-96dca",
  "private_key_id": "b399a10e90519d7bed9cd256c1eea6505258a824",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkUQmumTz4ehFj\nSJG/9kD8Dzz4vF3yGYiyQDftP+0fei2YGgfhVOk78izOFfCgfosU5ApgrA+GsBey\nj6hnQrpzIvNmcPOrhzYFI7AZQqOHgsO5489QH0H6+TJZIR3lv0pmPOCnQLlsNrWg\nCLE16nRLxvYkSq3ePY8TsOEYzsqQW2NoTWTUiWhx7IHmTUQ1Yk8qgoiu0jhG5dP9\ng7tMQQ9vWALW5fU/UmDhUTkH+tHdiK7qmKAc6FMSFhYj1Oed7ltppLv/Bo1NOWgA\nI6M9bpegKxXv+1GVx898/cqrvvloLQ7shtNrTNaiCJdg1FzPRgScvCtMQJ7XZAJw\nUJw4kjZDAgMBAAECggEAFGakA0OvAGdgzEkLdjV0A7eSnuFS8Abqjr25aTae0WHW\nfQQnsVAyYF56NfYfDkDX3Mv5W9+mUoHU12HNtfsLciscjuim4EeP1fCEjIZWY7Hr\nwiMo2gOff10RkA5ethKGLA5n6BbO+W1g0dHydUVlk1j3C4d4HIKGcUVB6qtra/kH\nI9rAza2L/O/yIi5UCt5Un2GNSOMVrvsawVu/xIq5l82OnQAdnemTJh+DKijBr05Y\n8XbivB7ZKBRGhLB7Q9+vVR0+c2dgdXW/b69tuYC+jtWnRwdJu41sgnMolYJGOjDG\n2xusuI0sTVykfqOcsIJd88HNsCU3XGHcBZZ8zeby3QKBgQDTcKSKUeegyhhyRSgb\n1JxYWnvKFykSnDvilKqWdF1wxVT7igNjcuvltxcGWiKORa9xsIm63e0s9yWwsOAC\nex2shcMPn2H7NL0PQh6yC93ouSXf1tAd0vTOcPyloYkx0k1pi4sHEQ75ZxgYuKvf\nM088zX1GLaxCTSlVu5EOyJsYfwKBgQDG8gwIOf8XMRKGwChCmxTVhO/l4TZTJzkK\nNpJvRIhO1X92fXHJF3+/kTvR1tuZQbHJ42QwBoPOJTanHx8I0CU6/waGDGPCIJit\nE/IoMkTPnXNbFiV3yV+1yfCS3jW5mgwkYjBMOjeAxJeT2RqvLchhdc6paAvHsixw\n73YHjLKgPQKBgDOaq13i7ZBNorfI7ygTtPDPbKT/EBQts2PyesvrrJ6IWtxla7xK\n4Q4YqHLxbruggFhUCNllrqwpybYdBR814yEnKFtYv/YqgfYGYi18PfW9smO2LucI\nhJ0Z8F+QVEanmCMpXo4j+K6gHb5y2+fGwxEI6glFvmQUJwF4nMep6EiLAoGAU6u7\nCb6ynWNjIk8w34pvwbluV+VXPrOxVq1K+wb8uQMr336021lJvhzr5r4Rj6xEhN9g\n5J3o00ttZ+471C4OaniVms0dK6kf7TMFVoiFzjevK3DuAyorWb57splISS4Tyz2M\niJK3gy2rfmABzAlaTDsK1s7OnYc/D6R2pIg1HBUCgYEAttkqVoRK6nyaEf7zYI6+\nfitmRNct1USAeJYcm7lWf4/4ZwIy4s5HSC11iinJhrCks75o0W0SIZ5Dfq5Sw/D9\nxEEevQPja/B5HeLDpJTOibzoyyrRvdBr2NTt6613AmTB5T2lSpz/fHPeOj7xRupu\nHoL4roL0/Jaej0A+156l34k=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-du9w5@mindmaple-96dca.iam.gserviceaccount.com",
  "client_id": "107758444948210731627",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-du9w5%40mindmaple-96dca.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: credential.cert(cred),
});

module.exports = admin;
