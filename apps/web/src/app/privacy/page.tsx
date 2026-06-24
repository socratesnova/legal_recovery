import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
                  <Shield className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-slate-900">
                  Legal Recovery <span className="text-emerald-600">OS</span>
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Política de Privacidad
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Última actualización: 10 junio 2026
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-emerald-300 bg-emerald-50 text-emerald-700"
            >
              <Shield className="mr-1 h-3 w-3" />
              Ley 172-13 Compliant
            </Badge>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* 1. Responsable del tratamiento */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                <CardTitle>1. Responsable del tratamiento</CardTitle>
              </div>
              <CardDescription>
                Identidad y datos de contacto del responsable
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                El responsable del tratamiento de los datos personales es{" "}
                <strong>Legal Recovery OS SRL</strong>, sociedad de responsabilidad
                limitada domiciliada en la República Dominicana, inscrita ante la
                Cámara de Comercio y Producción de Santo Domingo, RNC 131-99999-1.
              </p>
              <p className="mt-3">
                Somos una plataforma tecnológica especializada en la gestión de
                carteras castigadas y recuperación legal, que actúa como
                encargada del tratamiento en nombre de oficinas legales, bancos y
                fondos de inversión (entidades financieras adheridas).
              </p>
              <p className="mt-3">
                Toda comunicación relacionada con el tratamiento de datos puede
                dirigirse a nuestro Delegado de Protección de Datos (DPO) en{" "}
                <Link
                  href="mailto:dpo@legalrecovery.rd"
                  className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                >
                  dpo@legalrecovery.rd
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* 2. Datos que recopilamos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <CardTitle>2. Datos que recopilamos</CardTitle>
              </div>
              <CardDescription>
                Categorías de datos personales procesados en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                En el ejercicio de nuestras funciones de gestión de cartera y
                recuperación legal, recopilamos y procesamos únicamente los datos
                estrictamente necesarios, proporcionados por las entidades
                financieras adheridas o por el propio titular:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Datos de identificación:</strong> nombre completo,
                  número de cédula o pasaporte, fecha de nacimiento, estado
                  civil.
                </li>
                <li>
                  <strong>Datos de contacto:</strong> dirección postal,
                  correo electrónico, número de teléfono fijo y móvil.
                </li>
                <li>
                  <strong>Datos financieros:</strong> información de la
                  deuda, historial de pagos, saldos pendientes, números de
                  préstamo o tarjeta de crédito (enmascarados en interfaces
                  públicas).
                </li>
                <li>
                  <strong>Datos de ubicación:</strong> dirección del bien
                  hipotecado o prendado, cuando aplique.
                </li>
                <li>
                  <strong>Datos de comportamiento:</strong> registro de
                  comunicaciones, acuerdos de pago, disputas y consentimientos
                  otorgados.
                </li>
                <li>
                  <strong>Datos de terceros autorizados:</strong> co-deudores,
                  garantes solidarios o codeudores con obligación legal de pago,
                  siempre con base contractual.
                </li>
              </ul>
              <p className="mt-3">
                No recopilamos datos sensibles (salud, creencias religiosas,
                afiliación sindical, origen étnico) salvo que resulten
                estrictamente necesarios para un procedimiento judicial
                específico y con base legal expresa.
              </p>
            </CardContent>
          </Card>

          {/* 3. Finalidad del tratamiento */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-600" />
                <CardTitle>3. Finalidad del tratamiento</CardTitle>
              </div>
              <CardDescription>
                Propósitos específicos para los cuales utilizamos sus datos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Los datos personales son tratados con las siguientes finalidades
                legítimas y informadas:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  Gestión integral de carteras castigadas y recuperación de
                  activos financieros en vía extrajudicial y judicial.
                </li>
                <li>
                  Evaluación de riesgo crediticio y asignación de estrategias de
                  recuperación mediante modelos de scoring internos.
                </li>
                <li>
                  Contacto regulado con el titular y terceros autorizados a través
                  de canales aprobados (portal, correo, carta QR, voicebot, SMS,
                  WhatsApp con consentimiento previo).
                </li>
                <li>
                  Formalización, seguimiento y cumplimiento de acuerdos de pago,
                  convenios y reestructuraciones de deuda.
                </li>
                <li>
                  Atención de disputas, reclamaciones y ejercicio de derechos
                  ARCO por parte del titular.
                </li>
                <li>
                  Cumplimiento de obligaciones legales y regulatorias ante la
                  Junta Central Electoral (JCE), Superintendencia de Bancos
                  (SIB) y otras autoridades competentes.
                </li>
                <li>
                  Prevención de fraude, lavado de activos y financiamiento del
                  terrorismo (PLA/FT).
                </li>
                <li>
                  Emisión de reportes ejecutivos y auditoría interna para
                  entidades financieras adheridas.
                </li>
              </ul>
              <p className="mt-3">
                El tratamiento de datos para finalidades distintas a las
                anteriormente descritas requerirá consentimiento expreso,
                previo, informado e inequívoco del titular, salvo que exista
                otra base legal que lo habilite.
              </p>
            </CardContent>
          </Card>

          {/* 4. Base legal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <CardTitle>4. Base legal</CardTitle>
              </div>
              <CardDescription>
                Fundamentos jurídicos que habilitan el tratamiento de datos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                El tratamiento de datos personales en Legal Recovery OS se
                sustenta en las siguientes bases legales, de conformidad con la
                Ley No. 172-13 sobre Protección Integral de Datos Personales y
                su reglamento:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Ejecución de contrato (art. 36, num. 2):</strong>{" "}
                  El tratamiento es necesario para la ejecución de un contrato
                  en el que el titular es parte, o para tomar medidas a
                  petición del titular antes de celebrar un contrato (acuerdos
                  de pago, convenios de reestructuración).
                </li>
                <li>
                  <strong>Cumplimiento de obligación legal (art. 36, num. 1):</strong>{" "}
                  Obligaciones derivadas de la Ley Monetaria y Financiera,
                  Ley de Lavado de Activos, regulaciones de la SIB, y normas de
                  reporting crediticio.
                </li>
                <li>
                  <strong>Interés legítimo (art. 36, num. 4):</strong>{" "}
                  Recuperación de créditos legítimamente otorgados, siempre
                  que los derechos y libertades fundamentales del titular no
                  prevalezcan sobre dicho interés. Realizamos análisis de
                  equilibrio de intereses antes de invocar esta base.
                </li>
                <li>
                  <strong>Consentimiento del titular (art. 36, num. 3):</strong>{" "}
                  Para tratamientos adicionales, comunicaciones comerciales y
                  uso de canales digitales opt-in como WhatsApp.
                </li>
              </ul>
              <p className="mt-3">
                Cada dato procesado en nuestra plataforma está etiquetado con
                su base legal correspondiente, registrada en su{" "}
                <em>Data Passport</em> y verificable ante auditoría.
              </p>
            </CardContent>
          </Card>

          {/* 5. Derechos del titular (ARCO) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                <CardTitle>5. Derechos del titular (ARCO)</CardTitle>
              </div>
              <CardDescription>
                Acceso, Rectificación, Cancelación y Oposición
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                En ejercicio de los derechos conferidos por la Ley No. 172-13,
                todo titular de datos personales tiene derecho a:
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">Acceso</h4>
                  <p className="mt-1 text-slate-600">
                    Conocer qué datos personales suyos están siendo tratados,
                    su procedencia, las finalidades, los destinatarios y el
                    estado de las transferencias realizadas o por realizar.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">
                    Rectificación
                  </h4>
                  <p className="mt-1 text-slate-600">
                    Solicitar la corrección, actualización o supresión de datos
                    inexactos, erróneos, desactualizados o incompletos.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">
                    Cancelación (supresión)
                  </h4>
                  <p className="mt-1 text-slate-600">
                    Solicitar la eliminación de sus datos cuando ya no sean
                    necesarios para las finalidades informadas, cuando expire
                    el plazo legal de conservación o cuando revoque su
                    consentimiento.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">Oposición</h4>
                  <p className="mt-1 text-slate-600">
                    Oponerse al tratamiento de sus datos para fines específicos,
                    especialmente a fines de contacto comercial o de marketing,
                    sin perjuicio de la gestión judicial o extrajudicial de la
                    deuda.
                  </p>
                </div>
              </div>
              <p className="mt-4">
                El ejercicio de derechos ARCO puede realizarse a través del
                Portal Deudor, por correo electrónico a{" "}
                <Link
                  href="mailto:dpo@legalrecovery.rd"
                  className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                >
                  dpo@legalrecovery.rd
                </Link>{" "}
                o mediante escrito dirigido a nuestras oficinas. Responderemos
                dentro de los 15 días hábiles siguientes a la recepción de la
                solicitud completa.
              </p>
            </CardContent>
          </Card>

          {/* 6. Transferencia de datos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <CardTitle>6. Transferencia de datos</CardTitle>
              </div>
              <CardDescription>
                Destinatarios, encargados y transferencias nacionales o
                internacionales
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Los datos personales pueden ser transferidos a terceros en las
                siguientes circunstancias, siempre con la debida protección
                contractual y técnica:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Entidades financieras adheridas (responsables):</strong>{" "}
                  Devolución de información actualizada sobre el estado de
                  cartera, pagos recibidos y acuerdos ejecutados.
                </li>
                <li>
                  <strong>Oficinas legales externas:</strong>{" "}
                  Colaboradores que actúan como encargados del tratamiento bajo
                  contrato con cláusulas de confidencialidad y seguridad.
                </li>
                <li>
                  <strong>Proveedores tecnológicos:</strong>{" "}
                  Servicios de hosting, procesamiento de pagos, firma digital y
                  análisis de datos, con sede en jurisdicciones con nivel
                  adecuado de protección o mediante cláusulas contractuales
                  tipo aprobadas.
                </li>
                <li>
                  <strong>Autoridades competentes:</strong>{" "}
                  Junta Central Electoral, Superintendencia de Bancos,
                  Unidad de Análisis Financiero (UAF), tribunales y fiscales,
                  únicamente ante requerimiento legal fundado.
                </li>
                <li>
                  <strong>Burós de crédito:</strong>{" "}
                  Reporte de información crediticia con base en contratos de
                  adhesión y regulaciones de la SIB.
                </li>
              </ul>
              <p className="mt-3">
                No transferimos datos personales a terceros para fines de
                mercadeo sin consentimiento expreso del titular. Las
                transferencias internacionales se realizan únicamente a
                países o sectores con nivel de protección reconocido como
                adecuado por la autoridad de protección de datos de la
                República Dominicana o bajo salvaguardas contractuales
                verificables.
              </p>
            </CardContent>
          </Card>

          {/* 7. Seguridad de la información */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                <CardTitle>7. Seguridad de la información</CardTitle>
              </div>
              <CardDescription>
                Medidas técnicas, administrativas y físicas de protección
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Legal Recovery OS implementa un sistema de seguridad de la
                información basado en el principio de defensa en profundidad,
                alineado con la Ley No. 172-13 y estándares internacionales
                (ISO/IEC 27001):
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Cifrado en tránsito y en reposo:</strong>{" "}
                  TLS 1.3 para todas las comunicaciones; AES-256 para bases de
                  datos y backups.
                </li>
                <li>
                  <strong>Control de acceso basado en roles (RBAC/ABAC):</strong>{" "}
                  Autenticación multifactor (MFA), autorización por rol,
                  institución, cartera y nivel de sensibilidad de datos.
                </li>
                <li>
                  <strong>Legal Firewall:</strong>{" "}
                  Motor de reglas que bloquea automáticamente el acceso a datos
                  sin base legal, contactos no autorizados y uso de canales
                  restringidos.
                </li>
                <li>
                  <strong>Data Passport:</strong>{" "}
                  Cada campo de datos incluye metadatos de seguridad y uso
                  permitido; cualquier acceso es evaluado contra las reglas del
                  pasaporte antes de concederse.
                </li>
                <li>
                  <strong>Segmentación de red:</strong>{" "}
                  Microservicios aislados, PostgreSQL RLS (Row-Level Security),
                  red interna para servicios de IA y almacenamiento de
                  documentos en MinIO con políticas de bucket.
                </li>
                <li>
                  <strong>Monitoreo y alertas:</strong>{" "}
                  Detección de intrusiones, análisis de logs inmutables y alertas
                  en tiempo real ante accesos anómalos.
                </li>
                <li>
                  <strong>Planes de continuidad:</strong>{" "}
                  Backups diarios cifrados, replicación geográfica y pruebas
                  periódicas de restauración.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 8. Conservación */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                <CardTitle>8. Conservación</CardTitle>
              </div>
              <CardDescription>
                Plazos de retención y criterios de eliminación
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Los datos personales se conservan únicamente durante el tiempo
                necesario para cumplir con las finalidades informadas y con las
                obligaciones legales aplicables:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Datos de cartera activa:</strong> mientras persista
                  la relación contractual o la obligación de pago, más el
                  período de prescripción legal aplicable (generalmente 5 años).
                </li>
                <li>
                  <strong>Datos de casos cerrados:</strong> 5 años contados
                  desde la fecha de cierre definitivo, para fines de defensa
                  legal, auditoría regulatoria y prevención de fraude.
                </li>
                <li>
                  <strong>Datos de comunicaciones:</strong> 3 años desde la
                  última interacción, salvo obligación de conservación
                  específica derivada de un procedimiento judicial.
                </li>
                <li>
                  <strong>Datos de disputas y reclamaciones:</strong> 5 años
                  desde la resolución definitiva.
                </li>
                <li>
                  <strong>Logs de auditoría:</strong> 7 años, por requerimiento
                  de la SIB y normas de PLA/FT.
                </li>
              </ul>
              <p className="mt-3">
                Transcurrido el plazo de conservación, los datos personales se
                anonimizan o eliminan de forma segura, salvo que el titular
                solicite su conservación para la defensa de derechos en vía
                judicial.
              </p>
            </CardContent>
          </Card>

          {/* 9. Cookies y tecnologías */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-600" />
                <CardTitle>9. Cookies y tecnologías similares</CardTitle>
              </div>
              <CardDescription>
                Uso de cookies, local storage y tecnologías de seguimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Legal Recovery OS utiliza cookies y tecnologías similares para
                garantizar la funcionalidad de los portales, mejorar la
                seguridad y analizar el uso de la plataforma:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Cookies técnicas/necesarias:</strong> autenticación
                  de sesión, preferencias de idioma, seguridad CSRF/XSS. No
                  requieren consentimiento.
                </li>
                <li>
                  <strong>Cookies de preferencias:</strong> configuraciones de
                  visualización, filtros de dashboard y personalización de
                  interfaz. Se activan tras aceptación del aviso de cookies.
                </li>
                <li>
                  <strong>Cookies analíticas:</strong> métricas agregadas de
                  uso de portales (sin identificación personal), rendimiento y
                  detección de errores. No compartimos datos con terceros de
                  publicidad comportamental.
                </li>
              </ul>
              <p className="mt-3">
                El usuario puede gestionar sus preferencias de cookies a través
                del panel de configuración accesible en cada portal. La
                desactivación de cookies técnicas puede impedir el acceso a
                funcionalidades esenciales.
              </p>
            </CardContent>
          </Card>

          {/* 10. Cambios a esta política */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <CardTitle>10. Cambios a esta política</CardTitle>
              </div>
              <CardDescription>
                Procedimiento de actualización y notificación
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Legal Recovery OS se reserva el derecho de actualizar la
                presente Política de Privacidad para reflejar cambios en
                nuestras prácticas de tratamiento, requerimientos regulatorios,
                mejoras en la plataforma o desarrollos jurisprudenciales en
                materia de protección de datos.
              </p>
              <p className="mt-3">
                Toda modificación sustancial será notificada a los titulares
                registrados mediante correo electrónico o aviso destacado en los
                portales, con al menos 15 días naturales de anticipación a su
                entrada en vigor. El uso continuado de la plataforma después de
                la fecha de entrada en vigor constituirá aceptación de los
                términos actualizados.
              </p>
              <p className="mt-3">
                La versión vigente siempre estará disponible en{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                >
                  legalrecovery.rd/privacy
                </Link>{" "}
                con la fecha de última actualización indicada en el encabezado.
              </p>
            </CardContent>
          </Card>

          {/* 11. Contacto DPO */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <CardTitle>11. Contacto del Delegado de Protección de Datos</CardTitle>
              </div>
              <CardDescription>
                Canal principal para consultas, reclamaciones y ejercicio de
                derechos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-700">
              <p>
                Para cualquier consulta relacionada con el tratamiento de datos
                personales, para ejercer sus derechos ARCO, para presentar una
                reclamación o para reportar un incidente de seguridad,
                comuníquese con nuestro Delegado de Protección de Datos (DPO):
              </p>
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="font-medium text-slate-900">
                  Delegado de Protección de Datos (DPO)
                </p>
                <p className="mt-1 text-slate-700">
                  Legal Recovery OS SRL
                </p>
                <p className="mt-1">
                  <Link
                    href="mailto:dpo@legalrecovery.rd"
                    className="inline-flex items-center gap-1 font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                  >
                    <Mail className="h-4 w-4" />
                    dpo@legalrecovery.rd
                  </Link>
                </p>
                <p className="mt-1 text-slate-600">
                  Santo Domingo, República Dominicana
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Tiempo de respuesta: 15 días hábiles. Para reclamaciones ante
                  la autoridad de protección de datos, consulte{" "}
                  <Link
                    href="https://www.instituciones.gob.do"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-slate-700"
                  >
                    instituciones.gob.do
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Passport explanation card */}
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-900">
                  ¿Qué es el Data Passport?
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-emerald-900">
              <p>
                El <strong>Data Passport</strong> es un mecanismo interno de
                Legal Recovery OS que acompaña cada campo de datos personales
                con un registro de metadatos obligatorios:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Fuente:</strong> entidad o sistema que originó el
                  dato (banco adherido, JCE, buró de crédito, titular).
                </li>
                <li>
                  <strong>Base legal:</strong> fundamento jurídico que habilita
                  el tratamiento (contrato, ley, interés legítimo,
                  consentimiento).
                </li>
                <li>
                  <strong>Usos permitidos:</strong> finalidades para las cuales
                  el dato puede emplearse.
                </li>
                <li>
                  <strong>Restricciones:</strong> canales, roles o contextos
                  donde el dato está prohibido.
                </li>
                <li>
                  <strong>Fecha de expiración:</strong> plazo máximo de
                  conservación según política interna y normativa.
                </li>
                <li>
                  <strong>Trazabilidad:</strong> registro inmutable de quién
                  accedió, cuándo y para qué propósito.
                </li>
              </ul>
              <p className="mt-3">
                El Data Passport permite que el <em>Legal Firewall</em> valide
                automáticamente cada acceso o uso de datos antes de ejecutarlo,
                bloqueando operaciones que incumplan las reglas de proveniencia,
                base legal o consentimiento. Esto garantiza que solo se procesen
                datos con fuente válida, uso autorizado y dentro de los plazos
                permitidos.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-slate-900">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">Legal Recovery OS</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
              <Link
                href="/"
                className="hover:text-slate-900 hover:underline underline-offset-2"
              >
                Inicio
              </Link>
              <Link
                href="/privacy"
                className="hover:text-slate-900 hover:underline underline-offset-2"
              >
                Privacidad
              </Link>
              <Link
                href="/portal/debtor"
                className="hover:text-slate-900 hover:underline underline-offset-2"
              >
                Portal Deudor
              </Link>
              <Link
                href="mailto:dpo@legalrecovery.rd"
                className="hover:text-slate-900 hover:underline underline-offset-2"
              >
                Contacto DPO
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            © 2026 Legal Recovery OS SRL. Todos los derechos reservados. ·
            República Dominicana
          </p>
        </div>
      </footer>
    </div>
  );
}
