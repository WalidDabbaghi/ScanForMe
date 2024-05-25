url="$1"
sudo sh -c "nmap $url -oX ./DocsXml/resultat.xml"
xsltproc ./DocsXml/resultat.xml -o ./DocsHtml/resultat.html