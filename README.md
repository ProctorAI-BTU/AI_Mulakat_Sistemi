# 🎓 AI Destekli Kopya Tespitli Online Sınav Sistemi

## 🎯 Projenin Amacı ve Hedefleri

Dünya genelinde her yıl 8 milyondan fazla öğrenci online sınavlara girmektedir. COVID-19 sonrası süreçte online sınavlarda kopya girişimleri %70'in üzerinde artış göstermiştir. Ancak mevcut sistemlerin çoğunda gerçek zamanlı bir yapay zeka analizi bulunmamakta, yalnızca basit kural tabanlı denetimler yapılmaktadır. 

**Temel Amacımız:** Mikroservis mimarisiyle çalışan; Yüz Tespiti, Göz Takibi, Ses Analizi ve Davranış Sınıflandırma olmak üzere 4 akıllı AI modülü ile gerçek zamanlı gözetim (Real-Time Proctoring) yapan yenilikçi bir platform geliştirmektir. Sistem, öğrenci davranışlarını saniyeler içinde analiz ederek anlık olarak 0-100 arası dinamik bir "Risk Skoru" üretir ve eğitmeni otomatik olarak uyarır.

### 🔌 Portable (Gömülebilir) B2B SaaS Mimarisi

Geliştirdiğimiz bu platform sadece bağımsız bir web uygulaması olarak değil, diğer şirketlerin ve kurumların kendi altyapılarına kolayca entegre edebileceği "Taşınabilir (Portable)" bir B2B SaaS ürünü olarak tasarlanmıştır:

* **API & Webhook Entegrasyonu:** Kurumlar, kendi LMS (Öğrenim Yönetim Sistemi) veya İK platformlarından REST API'lerimiz aracılığıyla sınav oturumu başlatabilir. Sınav bitiminde AI analiz sonuçları ve detaylı risk raporları Webhook'lar üzerinden kurumun kendi sistemine otomatik olarak iletilir.
* **Embeddable Widget / Iframe:** Kurumsal müşteriler, kendi web sitelerinin arayüzünü bozmadan sınav gözetim modülümüzü basit bir `<script>` etiketi veya `iframe` yardımıyla sayfalarına gömebilirler.
* **On-Premise (Yerel) Kurulum Desteği:** Veri gizliliği nedeniyle dış bulut servislerini kullanmak istemeyen şirketler için sistemimiz, Docker container yapısı sayesinde kurum içi (local) sunucularda tamamen izole ve güvenli bir şekilde ayağa kaldırılabilir.

## 👥 Takım Üyeleri ve Görevleri
Projemiz 8 kişilik yetkin bir mühendislik ekibi tarafından yürütülmektedir.

* **Koray Garip, Mehmet Özay, Yağmur Eraslan, Furkan Bulduklu, Yağmur Derin Abdil, Ahmet Güldaş, Beyza Kahraman, Zeynep Kaya**
* **Frontend Ekibi :** Sınav arayüzü, UI/UX tasarımı, React mimarisi, öğretmen paneli, WebSocket client ve kamera/mikrofon entegrasyonu.
* **Backend Ekibi :** API Gateway, Auth Servisi, Exam ve Proctoring servisleri, REST API ve genel sistem mimarisi kararları.
* **AI/ML Ekibi :** Yüz algılama (Face Detection), göz takibi (Eye Tracking) model eğitimleri, ses analizi, anomali tespiti ve Random Forest tabanlı risk skorlama algoritması.
* **DevOps Engineer:** Docker container yönetimi, CI/CD pipeline süreçleri, bulut altyapısı ve sistem izleme (monitoring).
* **QA Engineer:** Otomasyon testleri, %80 unit test kapsamı ve güvenlik stratejileri.

## 💻 Kullanılan Teknoloji Yığını
* **Frontend:** React.js 18, TailwindCSS, Socket.io Client, WebRTC API, Redux Toolkit
* **Backend:** Node.js / Express, JWT / OAuth2, REST API, WebSocket
* **AI / ML:** Python 3.11, TensorFlow 2.x, OpenCV 4.x, MediaPipe / DeepFace, Scikit-Learn
* **Veritabanı & Cache:** MongoDB 7, SqLite
* **DevOps & Güvenlik:** Docker Compose, GitHub Actions, HTTPS/TLS 1.3, Rate Limiting

## ⚙️ Yazılım Geliştirme Süreci (SDLC)
Projemizde çevik (Agile) pratikler ve test odaklı geliştirme benimsenmiştir. Mühendislik standartları olarak; **Clean Code ve SOLID** prensipleri (Single Responsibility, Open/Closed, DRY) katı bir şekilde uygulanmaktadır. CI/CD pipeline'ları ile sürekli entegrasyon sağlanmakta, her modül bağımsız olarak test edilmektedir (Birim Test Kapsamı hedefi ≥%80'dir). 

## 🤝 Çağrı: Bize Katılın ve Destek Olun!
Eğitim teknolojilerinde çığır açacak bu projenin kaynak kodlarını açık tutuyor ve topluluğun gücüne inanıyoruz.
* **Yazılımcılar:** Repomuzu fork'layarak katkıda bulunabilir, PR'larınızla AI modellerimizi veya mikroservislerimizi geliştirmede bize destek olabilirsiniz.
* **Yatırımcılar ve Bağışçılar:** Geleceğin sınav sistemini inşa ediyoruz. Dünya çapında 8 milyon öğrencinin kullandığı bu altyapıyı büyütmek, sunucu maliyetlerimizi (AWS/GPU) karşılamak ve kurumsal pazara (LMS entegrasyonları) açılmak için finansal desteklerinizi bekliyoruz. Detaylar için iletişime geçin!

## 📚 Dokümanlar
