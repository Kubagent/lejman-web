'use client';

export default function InterviewsPage() {
  // Mock data for interviews
  const interviews = [
    {
      id: 1,
      title: 'Conversation on Contemporary Art',
      publication: 'Artforum',
      year: 2022,
      url: '#'
    },
    {
      id: 2,
      title: 'The Moving Image in Painting',
      publication: 'Frieze Magazine',
      year: 2021,
      url: '#'
    },
  ];

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Interviews Content */}
      <div className="py-12">
        {interviews.map((interview, index) => (
          <div
            key={interview.id}
            className={`px-6 md:px-12 lg:px-24 py-12 ${
              index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <a
                href={interview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2 group-hover:opacity-70 transition-opacity">
                  {interview.title} →
                </h3>
                <p className="font-sans text-sm text-[#666666]">
                  {interview.publication} · {interview.year}
                </p>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
