from aiogram.types import InlineKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from config import BASE_SITE


def main_keyboard() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="🎮 Старт", web_app=WebAppInfo(url="https://toniumworld.com"))
    kb.button(text="Канал/Channel", url="https://t.me/ToWGameChat")
    kb.adjust(1)
    return kb.as_markup()

def chat_keyboard() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="🎮 Старт", web_app=WebAppInfo(url='https://toniumworld.com'))
    kb.button(text="Перейти в чат", url='https://t.me/ToWGameChat')
    # kb.button(text="📈 Мой рекорд", callback_data="show_my_record")
    kb.adjust(1)
    return kb.as_markup()