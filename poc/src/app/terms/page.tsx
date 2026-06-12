import Link from "next/link";
import { FileText, Scale, Shield, Mail } from "lucide-react";

function SectionCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        <span className="mr-2 text-slate-500">{number}.</span>
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-slate-700" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Términos de Servicio
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Legal Recovery OS
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Última actualización: <time dateTime="2026-06-10">10 junio 2026</time>
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-8 text-sm text-slate-600">
          Los presentes Términos de Servicio regulan el acceso y uso de la plataforma Legal Recovery OS,
          operada por <strong>Legal Recovery RD, S.R.L.</strong>, con domicilio en la República Dominicana.
          Al registrarse o utilizar cualquier funcionalidad, el usuario acepta quedar vinculado por estas
          disposiciones y por nuestra Política de Privacidad.
        </p>

        <div className="space-y-6">
          <SectionCard number="1" title="Definiciones">
            <p>
              Para efectos de estos Términos, se entenderá por: <strong>"Plataforma"</strong> el sistema
              de software conocido como Legal Recovery OS, accesible a través de los portales web
              /portal/admin, /portal/bank y /portal/debtor; <strong>"Usuario"</strong> toda persona
              física o jurídica que acceda a la Plataforma, ya sea en calidad de bufete de cobranza,
              entidad financiera, fondo de inversión o deudor; <strong>"Datos Personales"</strong>
              cualquier información que identifique o haga identificable a una persona física;
              <strong>"Portafolio"</strong> el conjunto de créditos, derechos de cobro o deudas
              gestionados a través de la Plataforma; <strong>"Caso"</strong> la unidad de trabajo
              individual que corresponde a la gestión de una deuda específica dentro de un Portafolio.
            </p>
          </SectionCard>

          <SectionCard number="2" title="Objeto del servicio">
            <p>
              Legal Recovery OS es una plataforma tecnológica de gestión de cobranzas y recuperación
              de cartera que permite a entidades financieras, fondos de inversión y bufetes
              especializados administrar casos de morosidad, automatizar comunicaciones, generar
              acuerdos de pago, gestionar documentación legal y obtener inteligencia analítica sobre
              la recuperabilidad de los créditos.
            </p>
            <p>
              La Plataforma no presta servicios de cobranza directa ni actúa como intermediario
              financiero. Su función se limita a proporcionar herramientas de software para la
              gestión interna de cartera y la automatización de procesos operativos, siempre bajo
              la dirección y control de la entidad titular de los créditos o sus mandatarios legales.
            </p>
          </SectionCard>

          <SectionCard number="3" title="Obligaciones del usuario">
            <p>
              El Usuario se obliga a: (a) proporcionar información veraz, exacta y actualizada durante
              el registro y la vigencia de la relación contractual; (b) mantener la confidencialidad
              de sus credenciales de acceso y notificar de inmediato cualquier uso no autorizado;
              (c) utilizar la Plataforma exclusivamente para fines lícitos y de conformidad con la
              legislación aplicable, incluyendo la Ley 172-13 sobre Protección Integral de Datos
              Personales; (d) no intentar acceder a datos de terceros sin la debida autorización
              legal o contractual; (e) no realizar ingeniería inversa, descompilación o extracción
              del código fuente; (f) cumplir con las políticas de uso aceptable publicadas
              periódicamente.
            </p>
            <p>
              El incumplimiento de cualquiera de estas obligaciones podrá dar lugar a la suspensión
              temporal o definitiva del acceso, sin perjuicio de las acciones legales que
              correspondan.
            </p>
          </SectionCard>

          <SectionCard number="4" title="Protección de datos (Ley 172-13)">
            <div className="flex items-start gap-3 rounded-md bg-slate-100 p-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
              <p className="text-slate-700">
                Legal Recovery RD, S.R.L. actúa como responsable del tratamiento de los datos
                personales procesados a través de la Plataforma en calidad de encargado, de
                conformidad con la Ley 172-13 y su reglamento.
              </p>
            </div>
            <p>
              Toda información personal de deudores, garantes o terceros relacionados se procesa
              con base en el interés legítimo de la recuperación de créditos, el cumplimiento de
              obligaciones contractuales o el consentimiento expreso cuando así se requiera. La
              Plataforma implementa mecanismos técnicos y organizativos de <em>Data Passport</em>
              que registran la fuente, base legal, usos permitidos y restricciones de cada campo de
              datos, garantizando el cumplimiento del principio de finalidad limitada.
            </p>
            <p>
              Los Usuarios son responsables de verificar que cuentan con la base legal necesaria
              para cargar o procesar datos en la Plataforma. La compañía se reserva el derecho de
              bloquear automáticamente aquellos datos cuyo <em>Data Passport</em> indique falta de
              fuente, base legal inválida o restricciones vigentes.
            </p>
          </SectionCard>

          <SectionCard number="5" title="Propiedad intelectual">
            <div className="flex items-start gap-3 rounded-md bg-slate-100 p-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
              <p className="text-slate-700">
                Todos los derechos de propiedad intelectual sobre la Plataforma, su código fuente,
                diseños, marcas, logotipos, algoritmos de scoring y modelos analíticos pertenecen
                exclusivamente a Legal Recovery RD, S.R.L.
              </p>
            </div>
            <p>
              Se otorga al Usuario una licencia de uso no exclusiva, intransferible y revocable
              para acceder y utilizar la Plataforma durante la vigencia de su contrato de
              suscripción. Esta licencia no implica cesión de derechos de propiedad intelectual
              alguna. Queda estrictamente prohibida la reproducción total o parcial, distribución,
              comunicación pública o transformación de la Plataforma sin autorización escrita previa.
            </p>
            <p>
              Los datos, portafolios, documentos y contenidos cargados por los Usuarios permanecen
              siendo de su propiedad, otorgando a la Plataforma únicamente los derechos necesarios
              para su procesamiento, almacenamiento y visualización con fines de prestación del servicio.
            </p>
          </SectionCard>

          <SectionCard number="6" title="Limitación de responsabilidad">
            <p>
              Legal Recovery RD, S.R.L. pone su mejor esfuerzo en mantener la disponibilidad,
              seguridad y exactitud de la Plataforma, pero no garantiza que el servicio sea
              ininterrumpido, libre de errores o apto para fines específicos del Usuario.
            </p>
            <p>
              En la máxima medida permitida por la ley aplicable, la responsabilidad de la compañía
              queda limitada al monto efectivamente pagado por el Usuario en los tres (3) meses
              inmediatamente anteriores al evento que origine la responsabilidad. En ningún caso
              serán responsables por daños indirectos, emergentes, punitivos o lucro cesante.
            </p>
            <p>
              La Plataforma no asume responsabilidad por la legalidad de las estrategias de cobro
              implementadas por los Usuarios, ni por el contenido de las comunicaciones enviadas a
              través de sus canales integrados (email, SMS, WhatsApp, cartas QR, voicebot). El
              Usuario es el único responsable de asegurar que dichas comunicaciones cumplen con la
              normativa de protección de datos, derechos del consumidor y regulación financiera
              vigente en la República Dominicana.
            </p>
          </SectionCard>

          <SectionCard number="7" title="Resolución y disputas">
            <p>
              Cualquiera de las partes podrá resolver la relación contractual mediante notificación
              escrita con treinta (30) días de anticipación, sin penalización adicional por
              rescisión anticipada, salvo por los montos adeudados por servicios ya prestados.
            </p>
            <p>
              En caso de controversia derivada de la interpretación o ejecución de estos Términos,
              las partes se comprometen a agotar primero una instancia de mediación administrada por
              el Centro de Resolución Alternativa de Controversias (CEDRAC) de la República
              Dominicana. Si la mediación no resulta exitosa dentro de los sesenta (60) días
              calendario siguientes a su solicitud, cualquiera de las partes podrá recurrir a
              arbitraje de derecho ante el Centro de Arbitraje y Mediación de la Cámara de
              Comercio y Producción de Santo Domingo (CAM/CCP), cuyo reglamento se aplica en
              sustancia, sin perjuicio de la facultad de las partes de acudir a los tribunales
              ordinarios para medidas cautelares.
            </p>
          </SectionCard>

          <SectionCard number="8" title="Ley aplicable">
            <p>
              Estos Términos de Servicio se rigen e interpretan de conformidad con las leyes de la
              República Dominicana, en particular la Ley 172-13 sobre Protección Integral de Datos
              Personales, la Ley 189-11 sobre Protección de los Derechos del Consumidor, la Ley
              10-04 sobre Seguridad de la Información y los datos de las personas físicas, y las
              normas del Banco Central de la República Dominicana aplicables a las entidades
              financieras.
            </p>
            <p>
              Cualquier disposición de estos Términos que resulte inválida o inaplicable será
              eliminada o limitada al mínimo necesario, sin afectar la validez de las restantes
              disposiciones.
            </p>
          </SectionCard>

          <SectionCard number="9" title="Contacto">
            <div className="flex items-start gap-3 rounded-md bg-slate-100 p-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
              <div className="text-slate-700">
                <p className="font-medium">Legal Recovery RD, S.R.L.</p>
                <p>República Dominicana</p>
                <p className="mt-1">
                  Correo electrónico:{" "}
                  <a
                    href="mailto:legal@legalrecovery.rd"
                    className="text-slate-900 underline underline-offset-2 hover:text-slate-700"
                  >
                    legal@legalrecovery.rd
                  </a>
                </p>
                <p>
                  Sitio web:{" "}
                  <a
                    href="https://legalrecovery.rd"
                    className="text-slate-900 underline underline-offset-2 hover:text-slate-700"
                  >
                    legalrecovery.rd
                  </a>
                </p>
              </div>
            </div>
            <p>
              Para ejercer sus derechos ARCO (acceso, rectificación, cancelación y oposición) sobre
              datos personales, envíe una solicitud escrita al correo indicado, adjuntando copia de
              su documento de identidad. Responderemos dentro de los quince (15) días hábiles
              siguientes a la recepción de la solicitud completa.
            </p>
          </SectionCard>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <Scale className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Legal Recovery RD, S.R.L. República Dominicana.
            </p>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-900 hover:underline">
                Privacy Policy
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/terms" className="hover:text-slate-900 hover:underline">
                Terms
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/contact" className="hover:text-slate-900 hover:underline">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
