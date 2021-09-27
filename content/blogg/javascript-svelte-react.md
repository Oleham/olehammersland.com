+++
title = "Javascript, Svelte og React"
date = "2021-09-27T17:30:58+02:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["javascrip","koding",]

include_toc = false
+++

Jeg har hatt en bok om JavaScript liggende hjemme i over ett år. Den handler om grunnleggende JavaScript samt en innføring i det sannsynligvis mest brukte rammeverket jQuery.

En venn har mast på meg i lang tid om at jeg må sjekke ut [Svelte](https://svelte.dev/), et visstnok fantastisk rammeverk som er superraskt og gjør det lekende lett å utvikle nettsider og apper. Før det har jeg hatt mest erfaring med rammeverkene Django og Hugo – sistnevnte er rammeverket som denne nettsiden er bygget på.

Derfor har jeg lekt meg litt med vanilla JavaScript de siste par ukene. Et av resultatene er å se på [Sykkel-siden](/sykkel/). Tanken var å teste hvordan jeg kan laste inn dynamiske data og bruke det til å produsere en HTML-side. Kult å skrive kode som skal utføres i frontenden, i besøkerens nettleser, i stedet for at det kjører på en server som i Django. Jeg har også just oppdatert [Blogg-oversikten](/blogg/) på denne siden, slik at ikke alle bloggposter vises samtidig, men deles opp i sider.

Det største hinderet for å komme i gang med Svelte, skulle likevel vise seg å være nvm-npm-node-trifektaen. Jeg brukte lang tid på å forstå hvordan det henger sammen. Fra tidligere er jeg vant til å skrive kode som kjøres gjennom en compiler/interpreter og hvor jeg selv importerer inn alle modulene, men i frontend-verdenen er det åpenbart litt mer komplisert. Alt må gå gjennom ulike npm-verktøy. Jeg brukte altfor lang tid fordi jeg ville starte Svelte-prosjekt helt fra scratch, men det er åpenbart forventet at man bare skal kopiere de ferdige prosjektmalene fra hjemmesiden deres. Det synes jeg personlig er lite tilfredsstillende. Med tid og krefter kan man nok få bedre innsikt i hva som skjer under panseret – jeg liker å vite alt som skjer.

Den gledelige nyheten er at Svelte er artig å bruke. Føler jeg fikk en grei, generell forståelse av hvordan det henger sammen. Noe som gav meg mestringsfølelse, er at jeg veldig godt kunne dra nytte av erfaringene fra Hugo, Django og Go sitt innebygde template-system. Svelte organiserer koden sin mer samlet. Både HTML/CSS og JavaScript pakkes inn i samme fil. Likevel føles det stort sett likt som tidligere rammeverk jeg har brukt: du har et HTML-basert template som fylles opp med andre templates, som igjen fylles opp av ulike parametere basert på brukerens input eller kanskje http-forespørsler. Det kjentes slettes ikke så fremmed. Den største overraskelsen for meg, er at Svelte i prinsippet er en compiler som oversetter prosjektet ditt til en ren JavaScript-fil. Faktisk er det derfor fullt mulig å lage JavaScript-kode som kan klippes inn i helt andre prosjekter.

Så langt har jeg laget to-tre veldig enkle apper i sjangeren «todo»-liste, hvor man skal kunne skape, slette, oppdatere og endre en gjøremålsliste (CRUD-operasjonene). Noen av disse prosjektene prøvde jeg å klippe inn i et urelatert HTML-dokument, og det fungerte også utmerket. At de kompilerte JavaScript-filene er såpass uavhengige, synes jeg er kult! Om jeg vil lage noe mer komplisert JavaScript for denne siden, vil jeg altså kunne gjøre det gjennom Svelte.

I dag tittet jeg også litt på React, som visstnok er et av de viktigste rammeverkene i 2021. Det virket heller ikke helt fremmed – teknikkene og arbeidstrinnene minner veldig mye om alle de andre rammeverkene.