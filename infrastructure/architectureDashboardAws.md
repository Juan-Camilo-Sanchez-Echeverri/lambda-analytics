# Pregunta de arquitectura:

Dibuja o describe la arquitectura AWS para el dashboard considerando:

## 1. Alta disponibilidad (Multi‑AZ)

Para garantizar que el dashboard continúe operativo, incluso si una zona presenta fallas, la infraestructura se reparte en dos zonas de disponibilidad.

- **CloudFront** entrega el contenido.
- **S3** almacena archivos estáticos de manera duradera y rápida.
- En la **VPC**, el tráfico entra por un **Load Balancer (ALB)**.
- Los contenedores en **ECS Fargate** se ejecutan en subnets privadas en ambas zonas.
- **RDS Multi‑AZ** mantiene una réplica lista para tomar el control en caso de falla.

**Resultado:** si una zona cae, el sistema sigue funcionando sin interrupciones.

## 2. Escalabilidad horizontal

La arquitectura puede crecer automáticamente según el tráfico o la carga.

- **ECS Fargate** aumenta o reduce la cantidad de contenedores según el uso.
- **CloudFront** y **S3** soportan grandes volúmenes de tráfico sin configuración adicional.
- **RDS** puede escalar verticalmente (más recursos) o agregar réplicas si se necesitan más lecturas.

**Resultado:** el sistema se adapta solo cuando sube la demanda.

## 3. Seguridad (VPC, Security Groups)

La arquitectura está diseñada para mantener la aplicación protegida.

### Segmentación de red

- **Subnets públicas:** alojan únicamente el **ALB**.
- **Subnets privadas:** contienen **ECS Fargate** y **RDS**, sin acceso directo desde Internet.

### Reglas esenciales (Security Groups)

- **ALB:** recibe tráfico HTTPS.
- **ECS:** solo acepta tráfico desde el ALB.
- **RDS:** solo permite conexiones desde ECS.

### Protección adicional

- Credenciales almacenadas en **Secrets Manager**.
- HTTPS con **certificados TLS**

**Resultado:** lo público es mínimo; la app y la base de datos están totalmente protegidas.

## 4. Almacenamiento de archivos estáticos

- El build del frontend se almacena en **S3**.
- **CloudFront** distribuye ese contenido con baja latencia.
- El bucket se mantiene **privado** gracias a OAC.
- Se restringe el bucket mediante políticas y CORS.
- Se aplican reglas de cache para mejorar aún más el rendimiento.

## 5. Base de datos administrada

- Se utiliza **Amazon RDS PostgreSQL**.
- Configurada en **Multi‑AZ** para disponibilidad continua.
- Conexiones protegidas mediante TLS.

**Resultado:** AWS se encarga de mantenimiento, respaldos y alta disponibilidad.

## 6. Monitoreo y logs

El sistema contaría con observabilidad completa para detectar y resolver problemas.

- **CloudWatch Logs:** registra los logs de los contenedores ECS.
- **CloudWatch Metrics:** monitorea uso de CPU, errores del ALB, estado de RDS, etc.
- **Alarmas:** notifican por correo o Slack mediante SNS.

**Resultado:** siempre tendremos registros de lo que sucede en el sistema.
