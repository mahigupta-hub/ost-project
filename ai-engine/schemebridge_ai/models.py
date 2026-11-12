from __future__ import annotations
from typing import Optional, Literal
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    """Citizen profile. Every field is optional; unknown fields are reported as 'missing info'."""
    name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[Literal["male", "female", "other"]] = None
    state: Optional[str] = None
    residence: Optional[Literal["rural", "urban"]] = None
    annual_income: Optional[int] = Field(None, ge=0, description="Annual family income in INR")
    category: Optional[Literal["General", "OBC", "SC", "ST", "EWS"]] = None
    occupation: Optional[str] = Field(
        None,
        description="farmer | student | street_vendor | artisan | self_employed | entrepreneur | "
                    "unemployed | salaried | homemaker | other",
    )
    education_level: Optional[Literal["school", "post_matric", "graduate", "postgraduate"]] = None
    owns_agricultural_land: Optional[bool] = None
    is_student: Optional[bool] = None
    is_bpl: Optional[bool] = None
    has_pucca_house: Optional[bool] = None
    has_bank_account: Optional[bool] = None
    has_lpg_connection: Optional[bool] = None
    has_daughter_under_10: Optional[bool] = None
    is_pregnant_or_lactating: Optional[bool] = None
    is_income_tax_payer: Optional[bool] = None
    is_govt_employee: Optional[bool] = None
    has_disability: Optional[bool] = None

    def occ(self) -> Optional[str]:
        return self.occupation.strip().lower().replace(" ", "_") if self.occupation else None
