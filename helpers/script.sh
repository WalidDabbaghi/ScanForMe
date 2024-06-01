
url="$1"
sudo sh -c "nmap $url -oX ./DocsXml/resultat.xml"
xsltproc ./DocsXml/resultat.xml -o ./DocsHtml/resultat.html
# nikto -h https://www."$url" -Format htm -output ./DocsHtml/resultatnikto.html -Tuning 9
# wkhtmltopdf -s "A4" -n ./DocsHtml/resultat.html ./DocsPdf/nmap.pdf
