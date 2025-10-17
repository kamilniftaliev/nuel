interface Props {
  from: string;
  to: string;
}

export function YandexMap({ from = "Moscow", to = "Saint Petersburg" }: Props) {
  const mapSrc = `https://yandex.com/map-widget/v1/?rtext=${encodeURIComponent(
    from,
  )}~${encodeURIComponent(to)}&rtt=auto`;

  return (
    <div className="w-full h-96">
      <iframe
        title="Yandex Map Route"
        src={mapSrc}
        width="100%"
        height="100%"
        // style={{ border: 0 }}
        allowFullScreen
        className="rounded-md border border-gray-400"
      />
    </div>
  );
}
