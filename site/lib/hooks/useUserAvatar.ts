import { useEffect } from 'react'
import { useUI } from '@components/ui/context'
import { getRandomPairOfColors } from '@lib/colors'

export const useUserAvatar = (name = 'userAvatar') => {
  const { userAvatar, setUserAvatar } = useUI()

  useEffect(() => {
    const userAvatarBg = localStorage.getItem(name);
    if (!userAvatar && userAvatarBg) {
      // Get bg from localStorage and push it to the context.
      setUserAvatar(userAvatarBg)
    }
    if (!userAvatarBg) {
      // bg not set locally, generating one, setting localStorage and context to persist.
      const bg = getRandomPairOfColors()
      const value = `linear-gradient(140deg, ${bg[0]}, ${bg[1]} 100%)`
      localStorage.setItem(name, value)
      setUserAvatar(value)
    }
  }, [])

  return {
    userAvatar,
    setUserAvatar,
  }
}
