document.addEventListener('DOMContentLoaded', function() {
    // Akordeon
    const acc = document.getElementsByClassName('accordion');
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        });
    }

    // .txt dosya tanımlama
    const dosyaListesi = [
        { dosyaYolu: 'gunluk.txt', hedefId: 'gunluk' }
    ];

    function txtDosyasiniYukle(dosyaYolu, hedefId) {
        fetch(dosyaYolu)
            .then(response => response.text())
            .then(data => {
                const metinAlani = document.getElementById(hedefId);
                const lines = data.split('\n');

                // Anahtar kelimeler ve ilgili açıklamalar  
                // {description: 'metin/modal/numune.txt', isFile: true} ..> modala .txt dosyası yükleme
                const keywordData = {
                    'Şekil 1': {
                        description: 'Şekil 1',
                        image: 'resim/sekil1.png'
                    },
                    'Şekil 2': {
                        description: 'Şekil 2',
                        image: 'resim/sekil2.png'
                    },
                    'Şekil 3': {
                        description: 'Şekil 3',
                        image: 'resim/sekil3.png'
                    },
                    'Şekil 4': {
                        description: 'Şekil 4',
                        image: 'resim/sekil4.png'
                    },
                    'Tablo 1': {
                        description: 'Tablo 1',
                        image: 'resim/tablo1.png'
                    }
                };

                lines.forEach(line => {
                    let formattedLine = line
                        .replace(/<bold>(.*?)<\/bold>/g, '<span class="bold">$1</span>')
                        .replace(/<italic>(.*?)<\/italic>/g, '<span class="italic">$1</span>')
                        .replace(/<sup>(.*?)<\/sup>/g, '<span class="sup">$1</span>')
                        .replace(/<sub>(.*?)<\/sub>/g, '<span class="sub">$1</span>')
                        .replace(/<indent>(.*?)<\/indent>/g, '<span class="indent">$1</span>')
                        .replace(/<center>(.*?)<\/center>/g, '<span class="center">$1</span>')
                        .replace(/<indented-bolum>(.*?)<\/indented-bolum>/g, '<span class="indented-bolum">$1</span>')
                        .replace(/<margin-top>(.*?)<\/margin-top>/g, '<div class="margin-top">$1</div>')
                        .replace(/<margin-alt>(.*?)<\/margin-alt>/g, '<div class="margin-alt">$1</div>')
                        .replace(/<chamois>(.*?)<\/chamois>/g, '<span class="chamois">$1</span>')
                        .replace(/<redorange>(.*?)<\/redorange>/g, '<span class="redorange">$1</span>')
                        .replace(/<coralblue>(.*?)<\/coralblue>/g, '<span class="coralblue">$1</span>');

                    // Her anahtar kelime için metni kontrol et ve etiket ekle
                    for (let [keyword, data] of Object.entries(keywordData)) {
                        let regex = new RegExp(`${keyword}`, 'gu');
                        formattedLine = formattedLine.replace(regex, `<a href="#" class="keyword" data-description="${data.description}" data-image="${data.image || ''}" data-isFile="${data.isFile || false}">${keyword}</a>`);
                    }

                    metinAlani.innerHTML += formattedLine + '<br>';
                });

                // Tıklama olaylarını ayarla
                document.querySelectorAll('.keyword').forEach(element => {
                    element.addEventListener('click', function(event) {
                        event.preventDefault();
                        const isFile = this.getAttribute('data-isFile') === 'true';
                        if (isFile) {
                            const filePath = this.getAttribute('data-description');
                            fetch(filePath)
                                .then(response => response.text())
                                .then(fileData => {
                                    let formattedFileData = fileData
                                        .replace(/<bold>(.*?)<\/bold>/g, '<span class="bold">$1</span>')
                                        .replace(/<italic>(.*?)<\/italic>/g, '<span class="italic">$1</span>')
                                        .replace(/<sup>(.*?)<\/sup>/g, '<span class="sup">$1</span>')  // üstte rakam
                                        .replace(/<sub>(.*?)<\/sub>/g, '<span class="sub">$1</span>')   // altta rakam
                                        .replace(/<indent>(.*?)<\/indent>/g, '<span class="indent">$1</span>')
                                        .replace(/<indented-bolum>(.*?)<\/indented-bolum>/g, '<span class="indented-bolum">$1</span>')
                                        .replace(/<margin-top>(.*?)<\/margin-top>/g, '<div class="margin-top">$1</div>')
                                        .replace(/<margin-bottom>(.*?)<\/margin-bottom>/g, '<div class="margin-bottom">$1</div>')
                                        .replace(/<chamois>(.*?)<\/chamois>/g, '<span class="chamois">$1</span>')
                                        .replace(/<redorange>(.*?)<\/redorange>/g, '<span class="redorange">$1</span>')
                                        .replace(/<center>(.*?)<\/center>/g, '<span class="center">$1</span>')
                                        .replace(/<coralblue>(.*?)<\/coralblue>/g, '<span class="coralblue">$1</span>');
                                    document.getElementById('modal-text').innerHTML = formattedFileData;
                                    document.getElementById('modal-image').src = '';
                                    document.getElementById('myModal').style.display = "block";
                                })
                                .catch(error => console.error('Hata:', error));
                        } else {
                            const description = this.getAttribute('data-description');
                            const image = this.getAttribute('data-image');
                            document.getElementById('modal-text').textContent = description;
                            document.getElementById('modal-image').src = image;
                            document.getElementById('myModal').style.display = "block";
                        }
                    });
                });

                // Modal kapatma düğmesi
                document.querySelector('.close').addEventListener('click', function() {
                    document.getElementById('myModal').style.display = "none";
                });

                // Modal dışına tıklanırsa kapatma
                window.addEventListener('click', function(event) {
                    if (event.target == document.getElementById('myModal')) {
                        document.getElementById('myModal').style.display = "none";
                    }
                });
            })
            .catch(error => console.error('Hata:', error));
    }

    function tumDosyalariYukle() {
        dosyaListesi.forEach(dosya => {
            txtDosyasiniYukle(dosya.dosyaYolu, dosya.hedefId);
        });
    }

    window.onload = tumDosyalariYukle;
});