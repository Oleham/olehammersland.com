+++
title = "Parsing av e-poster 📮"
date = "2021-02-16T18:31:38+01:00"

#
# description is optional
#
# description = "Jeg automatiserer lesing av e-poster for en kunde. BeautifulSoup og Mailparser. Spare tid og klikk på å automatisere e-postlesing"

tags = ["automatisering","bash","effektivisering","python",]
+++

Det er ikke alltid mulig å arbeide på en så effektiv måte som mulig. Ofte må man samarbeide med organisasjoner med en egen arbeidsflyt og kultur som ikke nødvendigvis er forenlig med hurtig arbeid. 

**To av verstingene de fleste oversettere blir tvunget til å bale med, er e-post og Excel-regneark.** Det er ikke så rart. For flere kunder som ikke nødvendigvis er så teknisk kompetente, fremstår Excel som grei måte å organisere tekst på. På samme måte er e-post en rask og umiddelbar måte å sende ut en fil når det ikke er noen etablert teknisk infrastruktur på plass ennå. Men det er ikke noen solid måte å arbeide på. Det er mange ulemper ved å distribuere filer på e-post:

* oversikt
* kapasitet (mental og kronisk)
* stress

Det første punktet gjelder oversikt: til tross for at jeg har jobbet mye med e-post, føler jeg fortsatt ikke at jeg helt har knekket koden for hvordan man skal sortere e-poster så effektivt som mulig. Spesielt når man også skal sortere flere kunder, flere kontaktpersoner og flere filer. Det har hendt meg at jeg har oversatt feil fil fordi jeg på samme tid fikk to filer tilsendt med tilnærmet samme navn.

Det at det tar tid å sortere e-post, lagre vedlegg og vedlikeholde mappestrukturer, er også ganske opplagt.

Balingen med e-post koster også mental *kapasitet*. Man er nødt til å konsentrere seg, holde tunga rett i munnen og bruke tid på å sortere og finne frem til riktig filer. Det er dessuten et *stressmoment* som henter meg ut av flytsonen jeg helst vil være i når jeg oversetter.
Dessuten er det vel nok rapporter nå om at for mange e-poster ikke er bra for mental helse. Likevel...

## Noen kunder elsker e-post

Det er bare å feise fakta. Som en stakkars frilanser er jeg jo der for å oppfylle kundens behov. Da er det flaks at man kan tenne lys i stedet for å forbanne mørket – ved å lære seg programmering.

Her vil jeg vise frem to Python-skript jeg har for å forenkle arbeidet med en kunde. Det er en stor kunde med et stort markedsføringsapparat: nyhetsbrev, bannere, TV-reklamer, you name it. 
De sender meg ca. 15 e-poster daglig. Hver av disse e-postene inneholder et sted mellom 4 og 50 bilder (jpg eller gif). Bildene inneholder et første utkast av det grafiske innholdet på opptil 6 forskjellige språk. Min jobb er å se på vedleggene med de norske layoutene og lese den norske teksten.

Det å lese gjennom bildene for å lete etter feil tar, ikke så lang tid. Men det å lese gjennom listen over vedlegg for å finne de som er relevante for meg, tar litt tid. Heldigvis kan det automatiseres med Python 🐍.

## Parsing med mailparser

Ved hjelp av [mailparser-biblioteket til Python](https://pypi.org/project/mail-parser/1.2.2/) har jeg derfor raskt laget et skript som:

1. Leter gjennom alle e-poster i samme mappe.
2. Sorterer alle vedlegg etter avsender og e-post.
3. Sletter alle som ikke er markert med NO for norsk.

Slik ser det ut:

```python
import os, mailparser, re

# Loops over emails in current directory
for raw_mail in os.listdir():

    # Unpack all files except the python files.
    # It is assumed that the current directory only contains emails
    if not raw_mail.endswith(".py") and os.path.isfile(raw_mail):

        # Extract sender and subject from email
        epost_obj = mailparser.parse_from_file(raw_mail)
        sender = epost_obj.from_[0][1]
        subject = epost_obj.subject
        new_subject = re.sub(r"\W", "", subject)

        # Create a folder structure based on sender and subject
        image_path = os.path.join(sender, new_subject)
        os.makedirs(image_path, exist_ok=True)

        # Write all attachments to the corresponding folder
        epost_obj.write_attachments(image_path)

        # Delete all files that don't contain NO in title
        for attach in os.listdir(image_path):
            if "_no." in attach or "NO" in attach:
                continue
            else:
                os.remove(os.path.join(image_path,attach))
    
```

Ikke et veldig elegant og effektivt skript, men det er en fin quick fix som finner frem alle de bildene jeg trenger fra 15 eposter og 100 vedlegg i løpet av få sekunder.

## E-poster fra Google Drive

Den nevnte kunden sender også en god del e-poster fra Google Drive. I prinsippet fungerer det på samme måte, men disse epostene inneholder opptil 80–90 lenker i stedet for vedlegg. Av disse skal jeg klikke på de som inneholder norsk tekst (ca. 10 %).

Quick-fix-løsningen på det ble å lagre epostene som HTML-filer og skrive et raskt skript som bruker [Python-biblioteket BeautifulSoup](https://pypi.org/project/beautifulsoup4/) til å parse HTML. Skriptet henter ut alle lenkene og åpner dem i nettleseren dersom de slutter på "_no.gif" eller "_no.jpg".

```python
import bs4, sys, webbrowser

# Enter name of HTML email as CL argument
if len(sys.argv) != 2:
	print("Usage: python get_no_links.py <name of file>")
	sys.exit()

filename = sys.argv[1]

with open(filename) as f:
	soup = bs4.BeautifulSoup(f, "lxml")

# Find all anchor tags in HTML
lenker = soup.find_all("a")

# Loop over all anchor tags
for lenk in lenker:
    try:
		proofname = lenk.span.text
	except:
		continue

    # Open all links which ends with "no.gif" or "no.jpg" in web browser
	if proofname.endswith("no.gif") or proofname.endswith("no.jpg"):
		print("Opened " + proofname)
		webbrowser.open(lenk.get("href"))

```
