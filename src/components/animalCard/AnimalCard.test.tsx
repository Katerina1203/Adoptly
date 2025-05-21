import { render, screen } from '@testing-library/react'
import AnimalCard from './AnimalCard'
import { takeAllPhotosForSingleAnimal } from '@/lib/actions'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}))

jest.mock('@/lib/actions', () => ({
  takeAllPhotosForSingleAnimal: jest.fn(),
  getCleanImagePath: (path) => {
    if (typeof path === 'string') {
      const parts = path.split('\\');
      const filename = parts[parts.length - 1];
      return `/images/${filename}`;
    }
    return '';
  }
}))

describe('AnimalCard', () => {
  const mockAnimal = {
    _id: 'test-id',
    description: 'test description',
    type: 'dog',
    age: '2 years',
    city: 'New York',
    gender: 'male',
    userID: 'user123'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders animal details correctly', async () => {
    const mockPhotos = [{ src: 'D:\\WorkSpace\\adoptly\\Adoptly\\public\\images\\dog.jpg' }]
    ;(takeAllPhotosForSingleAnimal as jest.Mock).mockResolvedValue(mockPhotos)

    const AnimalCardComponent = await AnimalCard({ animal: mockAnimal })
    render(AnimalCardComponent)

    expect(screen.getByText('dog')).toBeInTheDocument()
    expect(screen.getByText('2 years')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()
    expect(screen.getByAltText('dog image')).toHaveAttribute('src', '/images/dog.jpg')
  })

  test('displays "No image available" when no photos are available', async () => {
    (takeAllPhotosForSingleAnimal as jest.Mock).mockResolvedValue([]);

    const AnimalCardComponent = await AnimalCard({ animal: mockAnimal });
    render(AnimalCardComponent);

    expect(screen.getByText('No image available')).toBeInTheDocument();
  });

  test('displays "No image available" when photos is undefined', async () => {
    ;(takeAllPhotosForSingleAnimal as jest.Mock).mockResolvedValue(undefined)

    const AnimalCardComponent = await AnimalCard({ animal: mockAnimal })
    render(AnimalCardComponent)

    expect(screen.getByText('No image available')).toBeInTheDocument()
  })

  test('throws error when animal has no ID', async () => {
    const animalWithoutId = { ...mockAnimal, _id: undefined }

    await expect(AnimalCard({ animal: animalWithoutId as any })).rejects.toThrow('Animal ID is undefined')
  })

  test('calls takeAllPhotosForSingleAnimal with correct animal ID', async () => {
    ;(takeAllPhotosForSingleAnimal as jest.Mock).mockResolvedValue([{ src: 'D:\\WorkSpace\\adoptly\\Adoptly\\public\\images\\dog.jpg' }])

    await AnimalCard({ animal: mockAnimal })

    expect(takeAllPhotosForSingleAnimal).toHaveBeenCalledWith('test-id')
  })
})
