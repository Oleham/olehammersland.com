+++
title = "Maskinoversettelse i Azure"
date = "2021-03-25T16:28:09+01:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["automatisering","effektivisering","enkeltpersonforetak","memoq","oversettelse","python","translation","tysk","maskinoversttelse"]

include_toc = false
+++


Har tenkt på og jobbet litt med maskinoversettelse i mars. I denne posten sammenfatter jeg noen generelle tanker og idéer rundt temaet. Jeg liker selv å bruke maskinoversettelse, og har lyst til å på sikt dykke dypere ned i den tekniske delen av det.

## Ja til maskinoversettelser 📜🤖

Helt siden jeg startet som oversetter, har jeg hatt inntrykket av at det lureste jeg kan lære meg, er koding og maskinoversettelse. For meg er det ingen tvil om at maskinoversettelse kun er i startgropen, og at det vil bli mer og mer utbredt. Kvaliteten blir bedre og bedre, men ikke bare derfor – den generelle forbedringen i kvalitet vil med tiden møte på en større og større aksept for mindre oversettelsesfeil. Gevinsten med litt dårlig, maskinelt språk vil etterhvert overveie ulempene med alt for mange faktorer.

I dag leste jeg f.eks. i Süddeutsche Zeitung at rettsaken rundt Cum-Ex-skandalen, som skal starte i disse dager i Frankfurt, [ble utsatt i nesten 1 år fordi man ventet på en engelsk oversettelse av anklageskriften](https://www.sueddeutsche.de/wirtschaft/cum-ex-skandal-zum-prozessauftakt-fehlen-die-hauptpersonen-1.5245685) (som var på nesten 1000 sider, «selbst für Profis schwer zu lesen»). 

Det synes jeg er verdt å tenke gjennom en gang til. 

Saken handler om en rekke finansfolk som svindlet Europas sentralbanker for ufattelige *62,9 milliarder euro*! Vi burde fråde av raseri og få dem dømt så snart som mulig. Anklagemyndigheten er imidlertid likefullt nødt til å vente på et uendelig langt oversettelsesprosjekt som sikkert er utført av en rekke juridiske oversettere, mens flere av bakmennene lever som vanlig.

Tenk på alle forsinkelsene og kostnadene i forbindelse med rettsakter, anbudsrunder, osv. på tvers av landegrenser. Det kan være en fulltidsjobb for flere oversettere i flere år om f.eks. Oslo Sporveier bestiller et nytt signalsystem fra et firma i Tyskland. De færreste jubler vel over at kommunen skal lønne en rekke personer for å gjøre en potensiell meningsløs jobb (er det ikke lettere, billigere og mer givende for ingeniørene i Oslo Kommune å lese de engelske tekstene?). De fleste ønsker seg vel heller et godt t-banesystem.

Jeg synes ikke det er noen særlig verdi i å beskytte markedet for oversettere. Oversettelser er fantastiske fordi de lar oss få innblikk i andre verdener. Det er imidlertid ingenting mot å faktisk lære det andre språket. [Bransjemagasinet Slator](https://slator.com/) har et større perspektiv en ren «oversettelse», de snakker om «språktjenestebransjen». Den omfatter mer enn ren oversettelse, den omfatter også språkkurs, tolkning, maskinoversettelse, programvare, kulturformidling m.m. Og denne bransjen kommer nok alltid i høy grad til å finnes. 

Når motstandere mot maskinoversettelser krever at vi må «beskytte» oversettelser, synes jeg man glemmer den underliggende tragikken i å være avhengige av mellommenn for å kommunisere med sine medmennesker på tvers av landegrensene.

Målet må jo være at kommunikasjonen kan finne sted, så enkelt som mulig!

Så jeg tror bare det er å forvente mer og mer aksept for maskinoversettelser. [Man gjorde narr av kvaliteten på oversettelsene](https://www.dn.se/ekonomi/amazons-sverigelansering-hanas-for-oversattningsmissar/) da Amazon ble lansert i  Sverige, men tenk heller på de svimlende summende de sparte. Jeg tror ikke det bedre kvalitet som er den egentlig driveren: globalisering og mer interaksjon på tvers av landegrenser vil nok forbli den virkelig store driveren.

## Min bruk av MT

Spørsmålet er som alltid hvilken kvalitet man er villig til å betale for. Som oversetter vil jeg kunne være fleksibel når det gjelder graden av personlig vs. automatisert oversettelse. For å si det enkelt: om en kunde er villig til å betale for at jeg leverer en oversettelse av en årsrapport på 100 sider i løpet av én dag, 7,5 timer, så vil jeg kunne levere *noe*. Så får vi diskutere hvilke tilpasninger jeg realistisk skal prioritere for å levere et produkt som er akseptabelt for sitt formål.

Denne uken har jeg hatt det veldig, veldig travelt. Da en kunde ønsket oversettelse av en veldig generell tekst, hadde jeg egentlig ikke tid til det – men teksten så såpass generell ut at det var en kandidat for maskinoversettelse med de generelle MT-motorene til Microsoft, Google osv. Jo mer fagspesifikk en tekst er, med intern sjargong og interne forkortelser og lignende, desto mindre egnet vil den være (med mindre man trener opp en egen MT-motor for nettopp det fagfeltet/den kunden), mer om det siden.

Så jeg logget meg inn på Azure og satte opp en gratis oversetter. Fikk en API-nøkkel og la det inn i memoQ. Heldigvis stemte teorien – jeg sparte tid og fikk levert uten å ofre hele kvelden. Det beste er ofte at man ikke er nødt til å skrive så mye på tastaturet, men kan konsentrere seg om å endre i en allerede eksisterende tekstmal.

Forøvrig: med tiden håper jeg å kunne bruke europeiske [DeepL](https://www.deepl.com/translator) til å maskinoversette tekster for kunder. De har en fantastisk god maskinoversetter som gir glimrende oversettelser mellom tysk og engelsk. [Nå har de lagt ut støtte for 13 nye europeiske språk](https://slator.com/machine-translation/deepl-adds-13-european-languages-as-traffic-continues-to-surge/), blant annet svensk og dansk!

… men dessverre ikke norsk 😕

## GE-DE-PE-ERRR

Personvern er jo noe å tenke på. Når man bruker Microsoft Translator, laster man i prinsippet teksten opp til en av Azure sine mange servere. Det bør man gjøre kunden klar over, [til tross for at Microsoft lover at dataene er sikre](https://azure.microsoft.com/en-us/services/cognitive-services/translator/). Om kunden har betenkninger, kan man jo prøve seg med en liten reduksjon i ordpris for å gjøre det mer smakfullt. I min erfaring er det imidlertid ikke *så* mye tid å spare som kundene kanskje ser for seg. Man arbeider kanskje 20 % raskere som følge av at ikke alle ord må tastes inn første gangen. Men det egentlige arbeidet, det å skape en god og flytende tekst, gjenstår. Og det er vel det kunden *egentlig* betaler for? 

Det håper i hvert fall jeg – det er det jeg synes er gøy. Hvis ikke, kan vel bare maskinene ta seg av arbeidet?

Ironisk nok (jeg tror i hvert fall det er ironisk?), så har jeg merket at tekster om personvern er de som enklest lar seg oversette av Microsoft Translator. 🤫 Det beste resultatet jeg noen gang har hatt, var da jeg lastet opp en tekst med personvernretningslinjer. Det virket som om Microsoft Translator hadde lest den teksten før, fordi den spyttet ut en helt perfekt, menneskelig oversettelse med det samme. Det tok meg kun 15 minutter å lese gjennom to ganger for å konstatere at alt var rett. Så det er nok en del firmaer som har automatisert dette kjedelige lovkravet. 😁

## PyTorch? Tensorflow?

På sikt kunne jeg veldig gjerne tenke meg å lære meg hvordan man selv trener en maskinlæringsalgoritme for å lage sine egne maskinoversettelser. Det kunne vært en spennende pakke å tilby til kunder – jeg oversetter ikke bare, jeg lager en algoritme som blir ekspert på akkurat deres tekster! 

Jeg har forsøkt å sette meg inn i Tensorflow og PyTorch, men jeg forstår det liksom ikke helt. Det glipper.

I språklæring heter det at man lærer mest av å lese tekster hvor man forstår 80 %, slik at hjernen forstår helheten, og kan fokusere på å fylle inn de ukjente enkeltordene og -uttrykkene. Når jeg prøver å lese meg opp på maskinlæring, har jeg følelsen av at jeg ikke har nådd til disse 80 %-ene ennå. Jeg har ikke nok forutsetninger for å helt forestille meg hva det handler om.

Så for tiden leter jeg etter en god ressurs til å komme igang med det helt grunnleggende. Om du kjenner til en god ressurs for en nybegynner, gi meg gjerne noen tips :) (jeg liker bøker!)