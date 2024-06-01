url="$1"

   nikto -h https://www."$url" -Format htm -output ./DocsHtml/resultatnikto.html -Tuning 2

# sudo sh -c "nikto $url -oX ./DocsXml/resultat.xml"
# xsltproc ./DocsXml/resultatnikto.xml -o ./DocsHtml/resultatnikto.html