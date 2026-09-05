# Pasturómetro PWA

App para el celular: cámara + marcador ArUco en el plato → altura comprimida → kg MS/ha.
Funciona sin señal una vez instalada. No usa Play Store.

```
index.html      la app entera (UI + lógica, ~250 líneas)
aruco.js        js-aruco2 (detección de marcadores) empaquetado
manifest.json   para "Agregar a pantalla de inicio"
sw.js           service worker: cachea todo para uso offline
icon-*.png      íconos
```

## Publicar (5 minutos, GitHub Pages)

La cámara solo funciona sobre HTTPS, y GitHub Pages lo da gratis.

1. Creá un repo nuevo (por ejemplo `pasturometro`) y subí estos 6 archivos a la raíz.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
3. En un minuto queda en `https://TU_USUARIO.github.io/pasturometro/`.
4. Abrila en Chrome del celular → menú ⋮ → **Agregar a pantalla de inicio**.
   Ya queda instalada y funciona sin señal.

Alternativa para probar en casa sin subir nada: en la PC, dentro de la carpeta,
`python3 -m http.server 8000`, y en el celular abrir `http://IP_DE_LA_PC:8000`.
Chrome bloquea la cámara en HTTP salvo localhost, así que para esta prueba activá
en el celular `chrome://flags/#unsafely-treat-insecure-origin-as-secure` con
`http://IP_DE_LA_PC:8000`. Para el campo, usá la versión publicada.

## Uso

1. **Primera vez, "Más" → Calibrar cámara.** Plato apoyado en piso firme, medí
   con cinta del lente al marcador (cm), escribilo, tocá Calibrar. Eso fija la
   escala del celular y hace la tara. Se hace una sola vez por celular; si
   cambiás el soporte o la altura de montaje, repetila.
2. **Tara** en el campo si querés: plato en el suelo, tocá Tara. Rehace el cero
   sin tocar la calibración.
3. Ponés el nombre del potrero en "Más", y por cada punto: apoyás, mirás que el
   estado diga *Plato detectado* y tocás **Lectura**. Vibra y suma al promedio.
4. Al final, "Más" → **Descargar CSV* o **Compartir CSV** (WhatsApp, Drive, lo
   que sea). Columnas: potrero, ts, altura_cm, kg_ms_ha, curva, lat, lon, gps_m.

Cómo calcula: la distancia cámara–marcador es inversamente proporcional al lado
en píxeles del marcador. Con una sola distancia real conocida (la de la
calibración) queda determinada la constante y se obtiene
`altura = D(suelo) − D(actual)` sin necesidad de intrínsecos de cámara ni de saber
el tamaño exacto del marcador. Mediana de los últimos 7 frames.

## Consejos de campo

- Fijá el foco en la app de cámara del celular si Chrome no lo puede bloquear
  (algunos modelos cambian el zoom con el autofoco y mueve la escala 1–2 %).
- Marcador plastificado mate; el brillo del sol sobre plástico brillante rompe
  la detección.
- Con sombra propia sobre el marcador anda igual; lo que molesta es media sombra
  cortando el cuadrado.
- La curva A/B en "Más" acepta la de tus cortes; guardá una por especie/época y
  cambiá el nombre para que quede registrado en el CSV.
